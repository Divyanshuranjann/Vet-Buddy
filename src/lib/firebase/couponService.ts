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

export interface Coupon {
  id?: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  maxUses?: number;
  currentUses?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  categories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const couponsCollection = collection(db, "coupons");

// Create a new coupon
export const createCoupon = async (coupon: Coupon): Promise<string> => {
  try {
    const docRef = doc(couponsCollection);
    await setDoc(docRef, {
      ...coupon,
      currentUses: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

// Get all coupons
export const getAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const q = query(couponsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Coupon));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

// Get active coupons
export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    const q = query(
      couponsCollection,
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const now = new Date();
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Coupon))
      .filter(
        (coupon) =>
          new Date(coupon.validFrom) <= now && now <= new Date(coupon.validTo)
      );
  } catch (error) {
    console.error("Error fetching active coupons:", error);
    throw error;
  }
};

// Get coupon by code
export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  try {
    const q = query(couponsCollection, where("code", "==", code.toUpperCase()));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      const coupon = { id: doc.id, ...doc.data() } as Coupon;

      // Check if coupon is valid
      const now = new Date();
      if (
        coupon.isActive &&
        new Date(coupon.validFrom) <= now &&
        now <= new Date(coupon.validTo) &&
        (!coupon.maxUses || coupon.currentUses! < coupon.maxUses)
      ) {
        return coupon;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching coupon by code:", error);
    throw error;
  }
};

// Get single coupon
export const getCoupon = async (couponId: string): Promise<Coupon | null> => {
  try {
    const docRef = doc(couponsCollection, couponId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Coupon;
    }
    return null;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

// Update coupon
export const updateCoupon = async (
  couponId: string,
  updates: Partial<Coupon>
): Promise<void> => {
  try {
    const docRef = doc(couponsCollection, couponId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

// Delete coupon
export const deleteCoupon = async (couponId: string): Promise<void> => {
  try {
    await deleteDoc(doc(couponsCollection, couponId));
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

// Use coupon (increment usage count)
export const useCoupon = async (couponId: string): Promise<void> => {
  try {
    const coupon = await getCoupon(couponId);
    if (coupon) {
      const docRef = doc(couponsCollection, couponId);
      await updateDoc(docRef, {
        currentUses: (coupon.currentUses || 0) + 1,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error using coupon:", error);
    throw error;
  }
};

// Calculate discount
export const calculateDiscount = (
  coupon: Coupon,
  orderAmount: number
): number => {
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    return 0;
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return Math.min(discount, orderAmount);
};
