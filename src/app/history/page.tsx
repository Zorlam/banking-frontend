"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { transactionMeta } from "@/lib/transaction-meta";
import type { Transaction, TransactionHistoryResponse, TransactionType } from "@/types";

const FILTERS: { label: string; value: TransactionType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Transfers", value: "transfer_out" },
  { label: "Received", value: "transfer_in" },
  { label: "Deposits", value: "deposit" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Airtime", value: "airtime" },
];

const PER_PAGE = 12;

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<TransactionHistoryResponse>(`/transactions/history?page=${page}&perPage=${PER_PAGE}`)
      .then((data) => {
        setTransactions(data.transactions);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Transaction history
        </h1>
        <p className="mt-1 text-[0.95rem] text-ink-400">Every movement, down to the kobo.</p>
      </div>

      {/* Filter chips */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors
              ${
                filter === f.value
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 text-ink-500 hover:border-ink-400 hover:text-ink-900"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="bg-white divide-y divide-ink-100">
        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-ink-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <Inbox className="mb-3 h-8 w-8 text-ink-200" strokeWidth={1.5} />
            <p className="text-sm text-ink-400">No transactions match this filter.</p>
          </div>
        ) : (
          filtered.map((txn) => {
            const meta = transactionMeta[txn.type];
            const Icon = meta.icon;
            return (
              <div key={txn.id} className="flex items-center gap-4 px-5 py-4">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    meta.isCredit ? "bg-success-subtle text-success" : "bg-ink-50 text-ink-700"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {txn.counterpartyName ?? meta.label}
                  </p>
                  <p className="truncate text-xs text-ink-400">
                    {txn.description ? `${txn.description} · ` : ""}
                    {formatDateTime(txn.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p
                    className={`font-mono text-sm tabular font-medium ${
                      meta.isCredit ? "text-success" : "text-ink-900"
                    }`}
                  >
                    {meta.sign}₦{parseFloat(txn.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="font-mono text-xs tabular text-ink-400">
                    bal. ₦{parseFloat(txn.balanceAfter).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-ink-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 text-ink-700 transition-colors hover:border-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 text-ink-700 transition-colors hover:border-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
