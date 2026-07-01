"use client";

import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { api, ApiRequestError } from "@/lib/api";
import { formatAccountNumber, formatDate } from "@/lib/format";

export default function SettingsPage() {
  const { user, account } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/accounts/change-password", { currentPassword, newPassword });
      showToast("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-7">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-[0.95rem] text-ink-400">Manage your profile and security.</p>
      </div>

      <div className="flex flex-col gap-6 sm:max-w-lg">
        {/* Profile card */}
        <Card className="bg-white p-6 sm:p-7">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Profile</h2>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-ink-100 font-serif text-xl font-semibold text-ink-700">
              {user?.fullName?.charAt(0) ?? "—"}
            </div>
            <div>
              <p className="font-medium text-ink-900">{user?.fullName}</p>
              <p className="text-sm text-ink-400">{user?.email}</p>
            </div>
          </div>

          <dl className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-5">
            <Row label="Account number" value={account ? formatAccountNumber(account.accountNumber) : "—"} mono />
            <Row label="Currency" value={account?.currency ?? "—"} />
            <Row label="Member since" value={user ? formatDate(user.createdAt) : "—"} />
          </dl>
        </Card>

        {/* Security card */}
        <Card className="bg-white p-6 sm:p-7">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-ink-900" strokeWidth={1.75} />
            <h2 className="font-serif text-lg font-semibold text-ink-900">Change password</h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <Input
              label="Current password"
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              prefix={<Lock className="h-[18px] w-[18px]" strokeWidth={1.75} />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                  className="pointer-events-auto"
                >
                  {showCurrent ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                </button>
              }
            />
            <Input
              label="New password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              prefix={<Lock className="h-[18px] w-[18px]" strokeWidth={1.75} />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  className="pointer-events-auto"
                >
                  {showNew ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                </button>
              }
              hint="At least 8 characters, with a letter and a number."
            />

            {error ? (
              <p role="alert" className="rounded-xl bg-warning-subtle px-3.5 py-2.5 text-sm text-warning">
                {error}
              </p>
            ) : null}

            <Button type="submit" isLoading={isSubmitting} className="mt-1 self-start">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-ink-400">{label}</dt>
      <dd className={`text-sm font-medium text-ink-900 ${mono ? "font-mono tabular" : ""}`}>{value}</dd>
    </div>
  );
}
