"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ShopThemeContextValue = {
  dark: boolean;
  toggle: () => void;
};

const ShopThemeContext = createContext<ShopThemeContextValue | null>(null);
const KEY = "vetbuddy_shop_dark";

export function ShopThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) setDark(stored === "true");
  }, []);

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem(KEY, String(next));
      return next;
    });
  }, []);

  return (
    <ShopThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ShopThemeContext.Provider>
  );
}

export function useShopTheme() {
  const ctx = useContext(ShopThemeContext);
  if (!ctx) throw new Error("useShopTheme must be used within ShopThemeProvider");
  return ctx;
}
