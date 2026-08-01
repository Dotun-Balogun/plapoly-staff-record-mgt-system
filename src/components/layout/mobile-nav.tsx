"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS, STAFF_NAV_ITEMS } from "@/constants";
import { NavIcon } from "@/components/layout/nav-icon";

export function MobileNav({
  isAdmin,
  open,
  onClose,
}: {
  isAdmin: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const items = isAdmin ? ADMIN_NAV_ITEMS : STAFF_NAV_ITEMS;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <nav className="absolute inset-y-0 left-0 w-64 space-y-1 bg-background p-3 shadow-lg">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <NavIcon name={item.icon} className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
