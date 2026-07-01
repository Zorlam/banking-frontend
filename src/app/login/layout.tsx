import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand pane */}
      <div className="relative flex flex-col justify-between bg-ink-900 px-8 py-10 text-white sm:px-12 lg:w-[44%] lg:px-16 lg:py-14">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
            <span className="font-serif text-lg font-bold text-ink-900">Z</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">Zenith</span>
        </div>

        <div className="my-12 lg:my-0">
          <p className="mb-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Money, kept in <em className="italic text-ink-200">exact</em> figures.
          </p>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-ink-200">
            Swift Transactions!
          </p>
        </div>

        <p className="hidden text-sm text-ink-400 lg:block">
          © {new Date().getFullYear()} Zenith Private Banking
        </p>
      </div>

      {/* Form pane */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
