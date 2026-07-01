"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftRight, Smartphone, Hash, Phone } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReceiptModal } from "@/components/receipt-modal";
import { useAuth } from "@/hooks/use-auth";
import { api, ApiRequestError } from "@/lib/api";
import { formatNaira } from "@/lib/format";
import type { Account, Transaction } from "@/types";

type TransferMode = "bank" | "airtime";

function TransferPageInner() {
  const searchParams = useSearchParams();
  const initialMode: TransferMode = searchParams.get("type") === "airtime" ? "airtime" : "bank";

  const [mode, setMode] = useState<TransferMode>(initialMode);
  const [accountNumber, setAccountNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);

  const { account, setAccount } = useAuth();

  function resetForm() {
    setAccountNumber("");
    setPhone("");
    setAmount("");
    setDescription("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "bank") {
        const data = await api.post<{ account: Account; transaction: Transaction }>(
          "/transactions/transfer",
          { receiverAccountNumber: accountNumber.replace(/\s/g, ""), amount, description: description || undefined }
        );
        setAccount(data.account);
        setReceiptTxn(data.transaction);
      } else {
        const data = await api.post<{ account: Account; transaction: Transaction }>(
          "/transactions/airtime",
          { phone, amount }
        );
        setAccount(data.account);
        setReceiptTxn(data.transaction);
      }
      resetForm();
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
          Send money
        </h1>
        <p className="mt-1 text-[0.95rem] text-ink-400">
          Available balance: {formatNaira(account?.balance ?? "0")}
        </p>
      </div>

      <div className="mx-auto max-w-md">
        {/* Mode tabs */}
        <div className="mb-5 flex gap-2 rounded-2xl bg-ink-50 p-1.5">
          <TabButton active={mode === "bank"} onClick={() => setMode("bank")} icon={ArrowLeftRight} label="Bank transfer" />
          <TabButton active={mode === "airtime"} onClick={() => setMode("airtime")} icon={Smartphone} label="Airtime" />
        </div>

        <Card className="p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "bank" ? (
              <Input
                label="Recipient account number"
                type="text"
                inputMode="numeric"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                prefix={<Hash className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                placeholder="10-digit account number"
                maxLength={14}
              />
            ) : (
              <Input
                label="Phone number"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                prefix={<Phone className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                placeholder="+234 800 000 0000"
              />
            )}

            <Input
              label="Amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              prefix={<span className="font-medium">₦</span>}
              placeholder="0.00"
            />

            {mode === "bank" ? (
              <Input
                label="Note (optional)"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this for?"
                maxLength={120}
              />
            ) : null}

            {error ? (
              <p role="alert" className="rounded-xl bg-warning-subtle px-3.5 py-2.5 text-sm text-warning">
                {error}
              </p>
            ) : null}

           <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
  {amount && parseFloat(amount) > 0
    ? `${mode === "bank" ? "Send" : "Buy airtime for"} ₦${parseFloat(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : mode === "bank"
      ? "Send transfer"
      : "Buy airtime"}
</Button>
          </form>
        </Card>
      </div>

      <ReceiptModal isOpen={!!receiptTxn} onClose={() => setReceiptTxn(null)} transaction={receiptTxn} />
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ArrowLeftRight;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium
        transition-colors duration-150
        ${active ? "bg-white text-ink-900 shadow-card" : "text-ink-400 hover:text-ink-700"}
      `}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </button>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={null}>
      <TransferPageInner />
    </Suspense>
  );
}
