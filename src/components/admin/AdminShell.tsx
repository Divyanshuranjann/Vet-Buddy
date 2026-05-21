"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  CreditCard,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) router.replace("/admin/login");
    else setReady(true);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    router.push("/admin/login");
  };

  if (!ready) return null;

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-slate-900 p-4 md:block">
        <p className="font-display font-bold text-sky-brand">Vet Buddy Admin</p>
        <nav className="mt-6 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                pathname === href
                  ? "bg-sky-brand/20 text-sky-brand"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-8 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
