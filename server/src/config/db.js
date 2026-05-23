import admin from "firebase-admin";

export async function connectDB() {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_REALTIME_DB_URL,
      });
      
      console.log("✅ Firebase initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Firebase:", error.message);
      throw error;
    }
  }
}

export function getFirestore() {
  return admin.firestore();
}
