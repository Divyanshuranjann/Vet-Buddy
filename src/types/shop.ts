export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category?: { _id: string; name: string; slug: string };
  categorySlug: string;
  breed?: string;
  images: string[];
  price: number;
  compareAtPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  tags: string[];
  active?: boolean;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
};

export type Order = {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  paymentStatus: string;
  items: { name: string; quantity: number; price: number }[];
  createdAt: string;
};

export type ShopFilters = {
  category?: string;
  breed?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  bestSeller?: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};
