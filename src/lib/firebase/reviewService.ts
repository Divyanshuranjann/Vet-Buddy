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

export interface Review {
  id?: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful?: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewsCollection = collection(db, "reviews");

// Create a new review
export const createReview = async (review: Review): Promise<string> => {
  try {
    const docRef = doc(reviewsCollection);
    await setDoc(docRef, {
      ...review,
      helpful: 0,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Get all reviews
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const q = query(reviewsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Review));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get reviews for a product
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  try {
    const q = query(
      reviewsCollection,
      where("productId", "==", productId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Review));
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

// Get reviews by customer
export const getCustomerReviews = async (customerId: string): Promise<Review[]> => {
  try {
    const q = query(
      reviewsCollection,
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Review));
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    throw error;
  }
};

// Get single review
export const getReview = async (reviewId: string): Promise<Review | null> => {
  try {
    const docRef = doc(reviewsCollection, reviewId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Review;
    }
    return null;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};

// Update review
export const updateReview = async (
  reviewId: string,
  updates: Partial<Review>
): Promise<void> => {
  try {
    const docRef = doc(reviewsCollection, reviewId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Approve review
export const approveReview = async (reviewId: string): Promise<void> => {
  try {
    const docRef = doc(reviewsCollection, reviewId);
    await updateDoc(docRef, {
      status: "approved",
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error approving review:", error);
    throw error;
  }
};

// Reject review
export const rejectReview = async (reviewId: string): Promise<void> => {
  try {
    const docRef = doc(reviewsCollection, reviewId);
    await updateDoc(docRef, {
      status: "rejected",
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error rejecting review:", error);
    throw error;
  }
};

// Delete review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await deleteDoc(doc(reviewsCollection, reviewId));
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Get pending reviews
export const getPendingReviews = async (): Promise<Review[]> => {
  try {
    const q = query(
      reviewsCollection,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Review));
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    throw error;
  }
};

// Update helpful count
export const updateHelpfulCount = async (reviewId: string, increment: number): Promise<void> => {
  try {
    const review = await getReview(reviewId);
    if (review) {
      const docRef = doc(reviewsCollection, reviewId);
      await updateDoc(docRef, {
        helpful: Math.max(0, (review.helpful || 0) + increment),
      });
    }
  } catch (error) {
    console.error("Error updating helpful count:", error);
    throw error;
  }
};
