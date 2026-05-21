import type { Product, Category, ShopFilters, Pagination } from "@/types/shop";
import { DUMMY_PRODUCTS, DUMMY_CATEGORIES } from "./dummyProducts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

function filterDummyProducts(filters: ShopFilters) {
  let list = [...DUMMY_PRODUCTS];
  if (filters.category) {
    list = list.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.breed) {
    const b = filters.breed.toLowerCase();
    list = list.filter((p) => p.breed?.toLowerCase() === b);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters.bestSeller) list = list.filter((p) => p.isBestSeller);
  if (filters.minPrice) list = list.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice) list = list.filter((p) => p.price <= filters.maxPrice!);

  const sort = filters.sort || "newest";
  if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const total = list.length;
  const start = (page - 1) * limit;
  const products = list.slice(start, start + limit);

  return {
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) } as Pagination,
  };
}

export async function getProducts(filters: ShopFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  const data = await fetchAPI<{ products: Product[]; pagination: Pagination }>(
    `/products?${params}`
  );
  if (data?.products?.length) return data;
  return filterDummyProducts(filters);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await fetchAPI<Product>(`/products/${slug}`);
  if (data) return data;
  return DUMMY_PRODUCTS.find((p) => p.slug === slug || p._id === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchAPI<Category[]>("/categories");
  if (data?.length) return data;
  return DUMMY_CATEGORIES;
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string
): Promise<Product[]> {
  const { products } = await getProducts({ category: categorySlug, limit: 8 });
  return products.filter((p) => p.slug !== excludeSlug).slice(0, 4);
}

export async function createOrder(body: Record<string, unknown>) {
  return fetchAPI(`/orders`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function markOrderPaid(orderId: string) {
  return fetchAPI(`/orders/${orderId}/pay`, { method: "PATCH" });
}

export async function getShopConfig() {
  const data = await fetchAPI<{ upiId: string }>("/config");
  return data || { upiId: process.env.NEXT_PUBLIC_UPI_ID || "vetbuddy@upi" };
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Login failed");
  }
  return res.json();
}

export async function adminFetch<T>(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<T>;
}

export { API_URL };
