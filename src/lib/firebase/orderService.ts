import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  shippingAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ordersCollection = collection(db, "orders");

// Create a new order
export const createOrder = async (order: Order): Promise<string> => {
  try {
    const docRef = doc(ordersCollection);
    await setDoc(docRef, {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(ordersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get orders by customer
export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(
      ordersCollection,
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};

// Get single order
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(ordersCollection, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Update order
export const updateOrder = async (
  orderId: string,
  updates: Partial<Order>
): Promise<void> => {
  try {
    const docRef = doc(ordersCollection, orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  try {
    const docRef = doc(ordersCollection, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: Order["paymentStatus"]
): Promise<void> => {
  try {
    const docRef = doc(ordersCollection, orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await deleteDoc(doc(ordersCollection, orderId));
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatus = async (
  status: Order["status"]
): Promise<Order[]> => {
  try {
    const q = query(
      ordersCollection,
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};
