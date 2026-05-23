import admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_REALTIME_DB_URL,
      });
      
      console.log("✅ Firebase Admin SDK initialized");
    } catch (error) {
      console.error("❌ Error initializing Firebase Admin:", error.message);
    }
  }
};

export const getRealtimeDatabase = () => {
  initializeFirebaseAdmin();
  return admin.database();
};

export const getFirestore = () => {
  initializeFirebaseAdmin();
  return admin.firestore();
};

// Realtime Database - Appointments
export const getAppointmentFromDB = async (appointmentId) => {
  const db = getRealtimeDatabase();
  const snapshot = await db.ref(`appointments/${appointmentId}`).get();
  return snapshot.exists() ? snapshot.val() : null;
};

export const getAllAppointmentsFromDB = async () => {
  const db = getRealtimeDatabase();
  const snapshot = await db.ref("appointments").get();
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const data = snapshot.val();
  return Object.entries(data).map(([id, appointment]) => ({
    id,
    ...appointment,
  }));
};

export const createAppointmentInDB = async (appointmentData) => {
  const db = getRealtimeDatabase();
  const appointmentRef = db.ref("appointments").push();
  
  await appointmentRef.set({
    ...appointmentData,
    createdAt: admin.database.ServerValue.TIMESTAMP,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });
  
  return appointmentRef.key;
};

export const updateAppointmentInDB = async (appointmentId, updates) => {
  const db = getRealtimeDatabase();
  
  await db.ref(`appointments/${appointmentId}`).update({
    ...updates,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });
};

// Firestore - Orders
export const getOrderFromFirestore = async (orderId) => {
  const db = getFirestore();
  const doc = await db.collection("orders").doc(orderId).get();
  
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const getAllOrdersFromFirestore = async () => {
  const db = getFirestore();
  const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const createOrderInFirestore = async (orderData) => {
  const db = getFirestore();
  
  const newOrder = {
    ...orderData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  const docRef = await db.collection("orders").add(newOrder);
  return docRef.id;
};

export const updateOrderInFirestore = async (orderId, updates) => {
  const db = getFirestore();
  
  await db.collection("orders").doc(orderId).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

export default {
  getRealtimeDatabase,
  getFirestore,
  getAppointmentFromDB,
  getAllAppointmentsFromDB,
  createAppointmentInDB,
  updateAppointmentInDB,
  getOrderFromFirestore,
  getAllOrdersFromFirestore,
  createOrderInFirestore,
  updateOrderInFirestore,
};
