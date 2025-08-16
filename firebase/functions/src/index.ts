import * as functions from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import corsLib from 'cors';

admin.initializeApp();
const db = admin.firestore();
const REGION: any = 'europe-west1';

// Define secrets for Agora
const AGORA_APP_ID = defineSecret('AGORA_APP_ID');
const AGORA_APP_CERT = defineSecret('AGORA_APP_CERT');
const RTC_PROVIDER = defineSecret('RTC_PROVIDER'); // optional (e.g., "agora" | "zego")

// CORS configuration
const cors = corsLib({ origin: true });

// createJob → Make webhook
export const createJob = functions.region(REGION).https.onCall(async (data, ctx) => {
  if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  const jobRef = db.collection('jobs').doc();
  const job = {
    jobId: jobRef.id,
    userId: ctx.auth.uid,
    type: data.type,
    inputs: data.inputs || {},
    status: 'queued',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  await jobRef.set(job);

  const body = JSON.stringify({ jobId: job.jobId, type: job.type, inputs: job.inputs });
  const sig = crypto.createHmac('sha256', process.env.MAKE_SIGNING_SECRET!).update(body).digest('hex');
  await fetch(process.env.MAKE_WEBHOOK_URL!, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-signature': sig }, body
  });
  return { jobId: job.jobId };
});

// markJob ← Make callback
export const markJob = functions.region(REGION).https.onRequest(async (req, res) => {
  const { jobId, status, outputUrl, error } = req.body || {};
  if (!jobId) {
    res.status(400).send('missing jobId');
    return;
  }
  await db.doc(`jobs/${jobId}`).set(
    { status, outputUrl, error, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
  res.json({ ok: true });
});

// Agora RTC Token Generation (v2 callable function with secrets)
export const getRtcToken = functions.region(REGION).runWith({
  secrets: [AGORA_APP_ID, AGORA_APP_CERT, RTC_PROVIDER]
}).https.onCall(async (data, context) => {
  try {
    const appId = AGORA_APP_ID.value();
    const cert = AGORA_APP_CERT.value();
    const provider = RTC_PROVIDER.value() || 'agora';

    if (!appId || !cert) {
      throw new functions.https.HttpsError('failed-precondition', 'Agora credentials not configured');
    }

    if (provider !== 'agora') {
      throw new functions.https.HttpsError('failed-precondition', `RTC provider ${provider} not supported here.`);
    }

    const channel = data?.channel || `akili-${Date.now()}`;
    const uid = data?.uid || Math.floor(Math.random() * 1e9);
    const role = RtcRole.PUBLISHER;
    const expire = 60 * 30; // 30 mins

    const token = RtcTokenBuilder.buildTokenWithUid(appId, cert, channel, uid, role, expire);

    logger.info('Issued Agora RTC token', { channel, uid, provider });
    return { appId, channel, uid, token, expire };
  } catch (e: any) {
    logger.error('getRtcToken failed', e);
    throw new functions.https.HttpsError('internal', e?.message || 'Failed to mint token');
  }
});

// End call → post to Make
export const endCall = functions.region(REGION).https.onCall(async (data, ctx) => {
  if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  const { channel, minutes, msisdn = '', tier = 'free' } = data || {};
  if (!channel || minutes == null) throw new functions.https.HttpsError('invalid-argument', 'channel & minutes');
  await db.doc(`calls/${channel}`).set({
    userId: ctx.auth.uid, minutes, tier, status: 'ended',
    endedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  const body = JSON.stringify({ channel, minutes, userId: ctx.auth.uid, msisdn, tier });
  const sig = crypto.createHmac('sha256', process.env.MAKE_SIGNING_SECRET!).update(body).digest('hex');
  if (process.env.MAKE_CALLS_WEBHOOK_URL) {
    await fetch(process.env.MAKE_CALLS_WEBHOOK_URL!, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-signature': sig }, body
    });
  }
  return { ok: true };
});

// Payments (from Make)
export const markPayment = functions.region(REGION).https.onRequest(async (req, res) => {
  const { userId, channel, minutes, tier, amount, currency, gateway, status, providerRef } = req.body || {};
  if (!userId) {
    res.status(400).send('missing userId');
    return;
  }
  const ref = db.collection('payments').doc();
  await ref.set({
    paymentId: ref.id, userId, channel, minutes, tier,
    amount, currency, gateway, status, providerRef,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  res.json({ ok: true, paymentId: ref.id });
});

export const markCallSettled = functions.region(REGION).https.onRequest(async (req, res) => {
  const { channel, paymentId, amount, currency } = req.body || {};
  if (!channel) {
    res.status(400).send('missing channel');
    return;
  }
  await db.doc(`calls/${channel}`).set({
    settled: true, paymentId: paymentId || null,
    settledAt: admin.firestore.FieldValue.serverTimestamp(),
    charge: { amount, currency }
  }, { merge: true });
  res.json({ ok: true });
});

// Create order → Make will generate hosted payment link (stub)
export const paymentsCreateOrder = functions.region(REGION).https.onCall(async (_data, ctx) => {
  if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  return { paymentLink: 'https://payments.akilipesa.example/link/demo' };
});
