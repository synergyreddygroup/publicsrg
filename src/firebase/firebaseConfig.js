import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrgcmS21tzBdebXWT_nB0KKK7E6TPQuPw",
  authDomain: "public-c5d02.firebaseapp.com",
  projectId: "public-c5d02",
  storageBucket: "public-c5d02.firebasestorage.app",
  messagingSenderId: "957674654669",
  appId: "1:957674654669:web:78457643d617336329d284",
  measurementId: "G-4TB8PP2DM1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app); // Firestore instance