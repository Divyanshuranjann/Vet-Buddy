import { getFirestore } from "../config/db.js";

/**
 * Firestore utilities to replace MongoDB operations
 */

// Products Collection
export const productsDb = {
  async getAll(filters = {}) {
    const db = getFirestore();
    let query = db.collection("products").where("active", "==", true);

    if (filters.category) {
      query = query.where("categorySlug", "==", filters.category);
    }
    if (filters.breed) {
      query = query.where("breed", "==", filters.breed);
    }
    if (filters.bestSeller) {
      query = query.where("isBestSeller", "==", true);
    }

    // Handle price range
    if (filters.minPrice) {
      query = query.where("price", ">=", Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      query = query.where("price", "<=", Number(filters.maxPrice));
    }

    // Sorting
    const sortMap = {
      price_asc: ["price", "asc"],
      price_desc: ["price", "desc"],
      rating: ["rating", "desc"],
      newest: ["createdAt", "desc"],
    };
    const [field, direction] = sortMap[filters.sort] || sortMap.newest;
    query = query.orderBy(field, direction);

    // Get total count
    const snapshot = await query.get();
    const total = snapshot.size;

    // Pagination
    const limit = Number(filters.limit) || 12;
    const page = Number(filters.page) || 1;
    const skip = (page - 1) * limit;

    const docs = snapshot.docs.slice(skip, skip + limit).map(doc => ({
      _id: doc.id,
      ...doc.data(),
    }));

    return {
      products: docs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async searchByText(search) {
    const db = getFirestore();
    const snapshot = await db
      .collection("products")
      .where("active", "==", true)
      .get();

    const searchLower = search.toLowerCase();
    return snapshot.docs
      .filter(doc => {
        const data = doc.data();
        return (
          data.name?.toLowerCase().includes(searchLower) ||
          data.description?.toLowerCase().includes(searchLower) ||
          data.tags?.some(t => t.toLowerCase().includes(searchLower))
        );
      })
      .map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const db = getFirestore();
    const doc = await db.collection("products").doc(id).get();
    return doc.exists ? { _id: doc.id, ...doc.data() } : null;
  },

  async getBySlug(slug) {
    const db = getFirestore();
    const snapshot = await db
      .collection("products")
      .where("slug", "==", slug)
      .where("active", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { _id: doc.id, ...doc.data() };
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("products").add({
      ...data,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const db = getFirestore();
    await db.collection("products").doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection("products").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },

  async delete(id) {
    const db = getFirestore();
    await db.collection("products").doc(id).update({ active: false });
    return { message: "Product deactivated" };
  },
};

// Categories Collection
export const categoriesDb = {
  async getAll() {
    const db = getFirestore();
    const snapshot = await db
      .collection("categories")
      .where("active", "==", true)
      .orderBy("name", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data(),
    }));
  },

  async getById(id) {
    const db = getFirestore();
    const doc = await db.collection("categories").doc(id).get();
    return doc.exists ? { _id: doc.id, ...doc.data() } : null;
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("categories").add({
      ...data,
      active: true,
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const db = getFirestore();
    await db.collection("categories").doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection("categories").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },

  async delete(id) {
    const db = getFirestore();
    await db.collection("categories").doc(id).update({ active: false });
  },
};

// Orders Collection
export const ordersDb = {
  async getAll(filters = {}) {
    const db = getFirestore();
    let query = db.collection("orders");

    if (filters.status) {
      query = query.where("status", "==", filters.status);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const db = getFirestore();
    const doc = await db.collection("orders").doc(id).get();
    return doc.exists ? { _id: doc.id, ...doc.data() } : null;
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("orders").add({
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const db = getFirestore();
    await db.collection("orders").doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection("orders").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },

  async markPaid(id) {
    const db = getFirestore();
    await db.collection("orders").doc(id).update({
      status: "paid",
      paidAt: new Date().toISOString(),
    });
    const doc = await db.collection("orders").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },
};

// Coupons Collection
export const couponsDb = {
  async getAll() {
    const db = getFirestore();
    const snapshot = await db
      .collection("coupons")
      .where("active", "==", true)
      .get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  async getByCode(code) {
    const db = getFirestore();
    const snapshot = await db
      .collection("coupons")
      .where("code", "==", code.toUpperCase())
      .where("active", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { _id: doc.id, ...doc.data() };
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("coupons").add({
      ...data,
      code: data.code.toUpperCase(),
      active: true,
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const db = getFirestore();
    await db.collection("coupons").doc(id).update(data);
    const doc = await db.collection("coupons").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },

  async delete(id) {
    const db = getFirestore();
    await db.collection("coupons").doc(id).update({ active: false });
  },
};

// Customers Collection
export const customersDb = {
  async getAll() {
    const db = getFirestore();
    const snapshot = await db.collection("customers").get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  async getByEmail(email) {
    const db = getFirestore();
    const snapshot = await db
      .collection("customers")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { _id: doc.id, ...doc.data() };
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("customers").add({
      ...data,
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const db = getFirestore();
    await db.collection("customers").doc(id).update(data);
    const doc = await db.collection("customers").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },
};

// Reviews Collection
export const reviewsDb = {
  async getByProduct(productId) {
    const db = getFirestore();
    const snapshot = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .where("approved", "==", true)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("reviews").add({
      ...data,
      approved: false,
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async approve(id) {
    const db = getFirestore();
    await db.collection("reviews").doc(id).update({ approved: true });
    const doc = await db.collection("reviews").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },

  async delete(id) {
    const db = getFirestore();
    await db.collection("reviews").doc(id).delete();
  },
};

// Admins Collection
export const adminsDb = {
  async getByEmail(email) {
    const db = getFirestore();
    const snapshot = await db
      .collection("admins")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { _id: doc.id, ...doc.data() };
  },

  async create(data) {
    const db = getFirestore();
    const docRef = await db.collection("admins").add({
      ...data,
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { _id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const db = getFirestore();
    await db.collection("admins").doc(id).update(data);
    const doc = await db.collection("admins").doc(id).get();
    return { _id: doc.id, ...doc.data() };
  },
};
