"use client";

import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatAccountNumber } from "@/lib/format";
import type { Transaction } from "@/types";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  recipientName?: string;
}

export function ReceiptModal({ isOpen, onClose, transaction, recipientName }: ReceiptModalProps) {
  if (!transaction) return null;

  const isAirtime = transaction.type === "airtime";

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="flex flex-col items-center py-2 text-center">
        <div className="animate-stamp-in flex h-16 w-16 items-center justify-center rounded-full border-2 border-success bg-success-subtle">
          <CheckCircle2 className="h-9 w-9 text-success" strokeWidth={1.5} />
        </div>

        <p className="mt-5 text-sm font-medium uppercase tracking-[0.15em] text-ink-400">
          {isAirtime ? "Airtime sent" : "Transfer complete"}
        </p>
        <p className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink-900 tabular">
          ₦{parseFloat(transaction.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </p>

        <div className="mt-7 w-full rounded-2xl border border-dashed border-ink-200 px-5 py-4 text-left">
          <ReceiptRow
            label={isAirtime ? "Phone number" : "Recipient"}
            value={
              isAirtime
                ? transaction.counterpartyAccountNumber ?? "—"
                : recipientName ?? transaction.counterpartyName ?? "—"
            }
          />
          {!isAirtime && transaction.counterpartyAccountNumber ? (
            <ReceiptRow
              label="Account number"
              value={formatAccountNumber(transaction.counterpartyAccountNumber)}
              mono
            />
          ) : null}
          <ReceiptRow label="Reference" value={transaction.id.slice(0, 13).toUpperCase()} mono />
          <ReceiptRow label="Date" value={formatDateTime(transaction.createdAt)} />
          <ReceiptRow
            label="Balance after"
            value={`₦${parseFloat(transaction.balanceAfter).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`}
            mono
            last
          />
        </div>

        <Button onClick={onClose} size="lg" className="mt-7 w-full">
          Done
        </Button>
      </div>
    </Modal>
  );
}

function ReceiptRow({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2 ${!last ? "border-b border-ink-100" : ""}`}>
      <span className="text-sm text-ink-400">{label}</span>
      <span className={`text-sm font-medium text-ink-900 ${mono ? "font-mono tabular" : ""}`}>{value}</span>
    </div>
  );
}
