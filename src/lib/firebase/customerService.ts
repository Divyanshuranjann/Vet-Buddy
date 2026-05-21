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
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface Customer {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  petName?: string;
  petType?: string;
  petBreed?: string;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const customersCollection = collection(db, "customers");

// Create a new customer
export const createCustomer = async (customer: Customer): Promise<string> => {
  try {
    const docRef = doc(customersCollection);
    await setDoc(docRef, {
      ...customer,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const snapshot = await getDocs(customersCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Customer));
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Get single customer
export const getCustomer = async (customerId: string): Promise<Customer | null> => {
  try {
    const docRef = doc(customersCollection, customerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Customer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

// Get customer by email
export const getCustomerByEmail = async (email: string): Promise<Customer | null> => {
  try {
    const q = query(customersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Customer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    throw error;
  }
};

// Get customer by userId
export const getCustomerByUserId = async (userId: string): Promise<Customer | null> => {
  try {
    const q = query(customersCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Customer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer by userId:", error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (
  customerId: string,
  updates: Partial<Customer>
): Promise<void> => {
  try {
    const docRef = doc(customersCollection, customerId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (customerId: string): Promise<void> => {
  try {
    await deleteDoc(doc(customersCollection, customerId));
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

// Update customer order stats
export const updateCustomerStats = async (
  customerId: string,
  orderAmount: number
): Promise<void> => {
  try {
    const customer = await getCustomer(customerId);
    if (customer) {
      const docRef = doc(customersCollection, customerId);
      await updateDoc(docRef, {
        totalOrders: (customer.totalOrders || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + orderAmount,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating customer stats:", error);
    throw error;
  }
};
