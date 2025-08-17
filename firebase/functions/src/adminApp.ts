import { getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const app = getApps().length ? getApp() : initializeApp(); // uses default credentials in CF
export const db = getFirestore(app);
