import * as admin from "firebase-admin";

const db = admin.firestore();

export async function checkDeviceQuota(deviceId: string, kind: "ai"|"call") {
  const ref = db.doc(`trialQuotas/${deviceId}`);
  const snap = await ref.get();
  const d = snap.exists ? snap.data()! : { day: "", ai: 0, calls: 0, updatedAt: Date.now() };
  const today = new Date().toISOString().slice(0,10);
  
  if (d.day !== today) { 
    d.day = today; 
    d.ai = 0; 
    d.calls = 0; 
  }
  
  if (kind === "ai" && d.ai >= 2) return false;
  if (kind === "call" && d.calls >= 1) return false;
  
  if (kind === "ai") d.ai += 1; 
  else d.calls += 1;
  
  d.updatedAt = Date.now();
  await ref.set(d, { merge: true });
  return true;
}
