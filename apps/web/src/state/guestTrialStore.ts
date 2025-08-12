type TrialState = {
  deviceId: string;
  freeCallsRemaining: number;
  aiTrialsRemaining: number;
  lastCallAt?: number;
  resetAt: string; // yyyy-mm-dd
  freeCallsEnabled: boolean; // from remote config/env
};

const KEY = "akp_trial_v1";

function today() {
  return new Date().toISOString().slice(0,10);
}

function loadDeviceId() {
  const k = "akp_device_id";
  let v = localStorage.getItem(k);
  if (!v) { v = crypto.randomUUID(); localStorage.setItem(k, v); }
  return v;
}

export function loadTrialState(freeCallsEnabled = false): TrialState {
  const raw = localStorage.getItem(KEY);
  const base: TrialState = {
    deviceId: loadDeviceId(),
    freeCallsRemaining: freeCallsEnabled ? 1 : 0,
    aiTrialsRemaining: 2,
    resetAt: today(),
    freeCallsEnabled
  };
  if (!raw) { localStorage.setItem(KEY, JSON.stringify(base)); return base; }
  const s = JSON.parse(raw) as TrialState;
  if (s.resetAt !== today()) {
    s.resetAt = today();
    s.aiTrialsRemaining = 2;
  }
  // keep free call at most 1 per day if enabled
  if (freeCallsEnabled && s.freeCallsRemaining > 1) s.freeCallsRemaining = 1;
  return s;
}

export function saveTrialState(s: TrialState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function canStartFreeCall(s: TrialState) {
  if (!s.freeCallsEnabled || s.freeCallsRemaining <= 0) return false;
  if (s.lastCallAt && Date.now() - s.lastCallAt < 10 * 60 * 1000) return false; // 10 min cooldown
  return true;
}
