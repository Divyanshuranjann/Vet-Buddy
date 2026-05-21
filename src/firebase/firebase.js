// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMK2uKk-5AziqbXB2aeCUEJdJrBfBMHk8",
  authDomain: "vet-buddy-ab66d.firebaseapp.com",
  projectId: "vet-buddy-ab66d",
  storageBucket: "vet-buddy-ab66d.firebasestorage.app",
  messagingSenderId: "803683793656",
  appId: "1:803683793656:web:9d1ac6fff71d90b0bb190d",
  measurementId: "G-1C8WW7EBR0",
  databaseURL: "https://vet-buddy-ab66d-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

// Analytics (optional)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export default app;