"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { api, ApiRequestError } from "@/lib/api";
import type { Account, Transaction } from "@/types";

const QUICK_AMOUNTS = ["5000", "10000", "25000", "50000"];

export function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAccount } = useAuth();
  const { showToast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await api.post<{ account: Account; transaction: Transaction }>(
        "/transactions/deposit",
        { amount }
      );
      setAccount(data.account);
      showToast(`₦${parseFloat(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })} deposited successfully.`);
      setAmount("");
      onClose();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setAmount("");
    setError("");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Deposit funds">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="1"
          required
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          prefix={<span className="font-medium">₦</span>}
          placeholder="0.00"
        />

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className="rounded-full border border-ink-200 px-3.5 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-50"
            >
              ₦{parseInt(v).toLocaleString("en-NG")}
            </button>
          ))}
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-warning-subtle px-3.5 py-2.5 text-sm text-warning">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-1 w-full">
  {amount && parseFloat(amount) > 0
    ? `Deposit ₦${parseFloat(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "Deposit"}
</Button>
      </form>
    </Modal>
  );
}
