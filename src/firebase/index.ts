import type { FirebaseApp } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "src/firebase/config";

const firebaseApp: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth();
export const db = getFirestore();

// eslint-disable-next-line import/no-default-export
export default firebaseApp;
