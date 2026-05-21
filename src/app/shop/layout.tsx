import type { Metadata } from "next";
import { ShopProviders } from "@/components/providers/ShopProviders";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { FloatingCartButton } from "@/components/shop/FloatingCartButton";

export const metadata: Metadata = {
  title: "Pet Shop",
  description:
    "Shop premium pet food, toys, medicines, grooming & accessories from Vet Buddy.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopProviders>
      <div className="min-h-screen bg-shop-dark text-white">{children}</div>
      <CartDrawer />
      <FloatingCartButton />
    </ShopProviders>
  );
}
