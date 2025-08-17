import * as functions from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const AGORA_APP_ID   = defineSecret("AGORA_APP_ID");
const AGORA_APP_CERT = defineSecret("AGORA_APP_CERT");

export const getRtcToken = functions.onRequest(
  { cors: true, secrets: [AGORA_APP_ID, AGORA_APP_CERT] },
  (req, res) => {
    try {
      const channel = String(req.query.channel || req.body?.channel || "akili");
      const uid     = Number(req.query.uid || req.body?.uid || 0);
      const expireSeconds = 60 * 5;

      const appId = AGORA_APP_ID.value();
      const cert  = AGORA_APP_CERT.value();
      if (!appId || !cert) {
        res.status(500).json({ error: "Missing Agora secrets" });
        return;
      }

      const role = RtcRole.PUBLISHER;
      const now = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = now + expireSeconds;

      const token = RtcTokenBuilder.buildTokenWithUid(
        appId, cert, channel, uid, role, privilegeExpiredTs
      );

      res.json({ appId, channel, uid, token, expiresIn: expireSeconds });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: "token_error" });
    }
  }
);
