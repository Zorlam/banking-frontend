"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" strokeWidth={1.75} />
      </div>
    );
  }

  if (!user) return null;

 return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar />
      <main>
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}