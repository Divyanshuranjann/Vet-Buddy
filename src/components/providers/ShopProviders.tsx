"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ShopThemeProvider } from "@/context/ShopThemeContext";

export function ShopProviders({ children }: { children: ReactNode }) {
  return (
    <ShopThemeProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </ShopThemeProvider>
  );
}
