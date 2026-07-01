"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  hideCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, title, children, hideCloseButton }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-3xl bg-white shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto"
      >
        {title || !hideCloseButton ? (
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
            {title ? (
              <h2 className="font-serif text-xl font-semibold text-ink-900">{title}</h2>
            ) : (
              <span />
            )}
            {!hideCloseButton ? (
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
