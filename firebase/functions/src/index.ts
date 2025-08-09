import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

export const ping = functions.https.onRequest((_req, res) => {
  res.json({ ok: true, service: "functions", ts: Date.now() });
});
