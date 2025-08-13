import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyBTTNjTKEPks9bFVZTUvWYcM62MWwF8HvI",
  authDomain: "akilipesa-prod.firebaseapp.com",
  projectId: "akilipesa-prod",
  storageBucket: "akilipesa-prod.firebasestorage.app",
  messagingSenderId: "26736767264",
  appId: "1:26736767264:web:6995208fbebca74057e745",
  measurementId: "G-MP4TRET15B" // optional
};

// Initialize Firebase app (safe for hot reload)
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Recommended defaults
setPersistence(auth, browserLocalPersistence);
enableIndexedDbPersistence(db).catch((error) => {
  if (error.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (error.code === 'unimplemented') {
    // The current browser does not support offline persistence
    console.warn('The current browser does not support offline persistence.');
  } else {
    console.warn('Failed to enable offline persistence:', error);
  }
});
