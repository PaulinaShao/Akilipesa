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

// Agora RTC Token Generation (v2 HTTPS function with secrets and CORS)
export const getRtcToken = onRequest(
  {
    region: 'europe-west1',
    secrets: [AGORA_APP_ID, AGORA_APP_CERT],
    cors: true
  },
  (req, res) => {
    cors(req, res, () => {
      try {
        const body = (req.method === 'POST' ? req.body : req.query) || {};
        const channel = String(body.channel || `ak-${Date.now().toString(36)}`);
        const uid = Number.isInteger(body.uid) ? Number(body.uid) : Math.floor(Math.random() * 2_000_000_000);

        const appId = AGORA_APP_ID.value();
        const appCert = AGORA_APP_CERT.value();
        if (!appId || !appCert) {
          res.status(500).json({ error: 'Agora credentials not configured' });
          return;
        }

        const role = RtcRole.PUBLISHER;
        const ttlSeconds = 60 * 60; // 1 hour
        const expireTs = Math.floor(Date.now() / 1000) + ttlSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(appId, appCert, channel, uid, role, expireTs);

        logger.info('Issued Agora RTC token', { channel, uid });
        res.json({ appId, channel, uid: String(uid), token, expiresIn: ttlSeconds });
      } catch (e: any) {
        logger.error('getRtcToken failed', e);
        res.status(500).json({ error: e?.message || 'Unknown error' });
      }
    });
  }
);

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
