import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface Category {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const categoriesCollection = collection(db, "categories");

// Create a new category
export const createCategory = async (category: Category): Promise<string> => {
  try {
    const docRef = doc(categoriesCollection);
    await setDoc(docRef, {
      ...category,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const q = query(categoriesCollection, orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Category));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get single category
export const getCategory = async (categoryId: string): Promise<Category | null> => {
  try {
    const docRef = doc(categoriesCollection, categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Category;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const allCategories = await getAllCategories();
    const category = allCategories.find((cat) => cat.slug === slug);
    return category || null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw error;
  }
};

// Update category
export const updateCategory = async (
  categoryId: string,
  updates: Partial<Category>
): Promise<void> => {
  try {
    const docRef = doc(categoriesCollection, categoryId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(categoriesCollection, categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Update product count
export const updateCategoryProductCount = async (
  categoryId: string,
  increment: number
): Promise<void> => {
  try {
    const category = await getCategory(categoryId);
    if (category) {
      const docRef = doc(categoriesCollection, categoryId);
      await updateDoc(docRef, {
        productCount: Math.max(0, (category.productCount || 0) + increment),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating category product count:", error);
    throw error;
  }
};
