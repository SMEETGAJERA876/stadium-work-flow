import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Using a "demo-" prefix allows us to use Firebase locally without a real project!
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0720316902"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Only connect to emulator if on localhost
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

