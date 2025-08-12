import { getAuth } from "firebase/auth";

export function isGuest(): boolean {
  const u = getAuth().currentUser;
  return !u || !!u.isAnonymous;
}

export function requireAuthOrGate(openGate: ()=>void, onOk: ()=>void) {
  if (isGuest()) openGate();
  else onOk();
}
