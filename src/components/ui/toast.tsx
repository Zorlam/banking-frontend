"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  variant: "success" | "error";
}

interface ToastContextValue {
  showToast: (message: string, variant?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: "success" | "error" = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2.5 sm:bottom-8 sm:right-8">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`
              flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-modal animate-slide-up
              ${toast.variant === "success" ? "border-ink-100 bg-ink-900 text-white" : "border-red-200 bg-white text-ink-900"}
            `}
          >
            {toast.variant === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" strokeWidth={1.75} />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" strokeWidth={1.75} />
            )}
            <p className="flex-1 text-sm leading-snug">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className={`flex-shrink-0 rounded-full p-0.5 ${toast.variant === "success" ? "text-white/70 hover:text-white" : "text-ink-400 hover:text-ink-900"}`}
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
