"use client";

import Link from "next/link";
import { Home, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Quản trị", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 group" aria-label="Về trang chủ Ký ức số">
          <BrandLogo />
        </Link>

        <div className="flex items-center gap-1 font-medium sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-3 text-sm transition-all duration-300 sm:px-4",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
