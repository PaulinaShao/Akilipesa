import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

admin.initializeApp();
const db = admin.firestore();
const REGION: any = 'europe-west1';

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
  if (!jobId) return res.status(400).send('missing jobId');
  await db.doc(`jobs/${jobId}`).set(
    { status, outputUrl, error, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
  res.json({ ok: true });
});

// Agora tokens
export const getRtcToken = functions.region(REGION).https.onCall(async (_data, ctx) => {
  if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  const appId = process.env.AGORA_APP_ID!;
  const cert = process.env.AGORA_APP_CERT!;
  const channel = `ai-${ctx.auth.uid}-${Date.now()}`;
  const uid = Math.floor(Math.random() * 1e9);
  const token = RtcTokenBuilder.buildTokenWithUid(appId, cert, channel, uid, RtcRole.PUBLISHER, 60 * 60);
  return { appId, channel, uid, token };
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
  if (!userId) return res.status(400).send('missing userId');
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
  if (!channel) return res.status(400).send('missing channel');
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
