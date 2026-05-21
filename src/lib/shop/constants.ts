import { SITE } from "@/lib/constants";

export const SHOP_ROUTES = {
  shop: "/shop",
  checkout: "/shop/checkout",
  product: (slug: string) => `/shop/product/${slug}`,
  admin: "/admin",
  adminLogin: "/admin/login",
} as const;

export const SHOP_CATEGORIES = [
  { name: "Dog Food", slug: "dog-food", icon: "🐕" },
  { name: "Cat Food", slug: "cat-food", icon: "🐈" },
  { name: "Pet Toys", slug: "pet-toys", icon: "🎾" },
  { name: "Medicines", slug: "medicines", icon: "💊" },
  { name: "Grooming", slug: "grooming", icon: "✂️" },
  { name: "Accessories", slug: "accessories", icon: "🦴" },
  { name: "Vaccines", slug: "vaccines", icon: "💉" },
] as const;

export const BREEDS = [
  {
    name: "Golden Retriever",
    slug: "golden-retriever",
    image:
      "https://images.unsplash.com/photo-1637402712989-6549b774f4e2?w=200&h=200&fit=crop",
  },
  {
    name: "Labrador",
    slug: "labrador",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
  },
  {
    name: "German Shepherd",
    slug: "german-shepherd",
    image:
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop",
  },
  {
    name: "Beagle",
    slug: "beagle",
    image:
      "https://images.unsplash.com/photo-1505628345066-241aa25ead57?w=200&h=200&fit=crop",
  },
  {
    name: "Husky",
    slug: "husky",
    image:
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop",
  },
  {
    name: "Shih Tzu",
    slug: "shih-tzu",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop",
  },
  {
    name: "Rottweiler",
    slug: "rottweiler",
    image:
      "https://images.unsplash.com/photo-1632150927906-099b3d4d1f0c?w=200&h=200&fit=crop",
  },
] as const;

export const PAYMENT = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "vetbuddy@upi",
  merchantName: SITE.name,
  gpay: "Google Pay",
  phonepe: "PhonePe",
  paytm: "Paytm",
} as const;

export const CART_STORAGE_KEY = "vetbuddy_cart";
export const WISHLIST_STORAGE_KEY = "vetbuddy_wishlist";
export const ADMIN_TOKEN_KEY = "vetbuddy_admin_token";
