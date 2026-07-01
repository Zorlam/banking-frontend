"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ArrowLeftRight,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/transfer", label: "Transfer", icon: ArrowLeftRight },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900">
            <span className="font-serif text-lg font-bold text-white">Z</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-ink-900">
            Zenith
          </span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition-colors hover:bg-ink-50"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </header>

      {isOpen ? (
        <div
          className="fixed inset-0 z-40 backdrop-blur-md bg-white/30 animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-100 bg-white
          shadow-modal transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900">
              <span className="font-serif text-lg font-bold text-white">Z</span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-ink-900">
              Zenith
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-900"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 px-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[0.95rem] font-medium
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-ink-900 text-white"
                          : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-ink-100 px-4 py-5">
          <div className="mb-3 flex items-center gap-3 px-3.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink-100 font-serif text-sm font-semibold text-ink-700">
              {user?.fullName?.charAt(0) ?? "—"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-900">
                {user?.fullName ?? "Loading…"}
              </p>
              <p className="truncate text-xs text-ink-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[0.95rem] font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-warning"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}