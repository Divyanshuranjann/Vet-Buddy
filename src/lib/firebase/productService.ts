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
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  sku: string;
  rating?: number;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productsCollection = collection(db, "products");

// Create a new product
export const createProduct = async (product: Product): Promise<string> => {
  try {
    const docRef = doc(productsCollection);
    await setDoc(docRef, {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// Get single product
export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(productsCollection, productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Update product
export const updateProduct = async (
  productId: string,
  updates: Partial<Product>
): Promise<void> => {
  try {
    const docRef = doc(productsCollection, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(productsCollection, productId));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Search products by name
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Update product stock
export const updateProductStock = async (
  productId: string,
  quantity: number
): Promise<void> => {
  try {
    const docRef = doc(productsCollection, productId);
    const product = await getProduct(productId);
    if (product) {
      await updateDoc(docRef, {
        stock: Math.max(0, product.stock + quantity),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
};
