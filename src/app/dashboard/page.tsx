"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowDownToLine,
  Smartphone,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { AmountDisplay } from "@/components/amount-display";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { formatAccountNumber, formatDate } from "@/lib/format";
import { transactionMeta } from "@/lib/transaction-meta";
import type { Transaction, TransactionHistoryResponse } from "@/types";
import { DepositModal } from "@/components/deposit-modal";

export default function DashboardPage() {
  const { user, account } = useAuth();
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  useEffect(() => {
    api
      .get<TransactionHistoryResponse>("/transactions/history?perPage=5")
      .then((data) => setRecent(data.transactions))
      .catch(() => {})
      .finally(() => setIsLoadingHistory(false));
  }, []);

  function handleCopy() {
    if (!account) return;
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const firstName = user?.fullName.split(" ")[0];

  return (
    <AppShell>
      <div className="mb-7">
        <p className="text-sm text-ink-400">
          {new Date().toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Good day, {firstName}
        </h1>
      </div>

      {/* Balance hero */}
      <Card className="relative overflow-hidden bg-ink-900 p-7 sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-ink-200">Available balance</p>
            <div className="mt-2 text-white">
              {balanceHidden ? (
                <span className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
                  ₦••••••
                </span>
              ) : (
                <AmountDisplay amount={account?.balance ?? "0"} className="text-white [&_.text-ink-400]:text-ink-200" />
              )}
            </div>
          </div>
          <button
            onClick={() => setBalanceHidden((v) => !v)}
            aria-label={balanceHidden ? "Show balance" : "Hide balance"}
            className="flex-shrink-0 rounded-full p-2 text-ink-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {balanceHidden ? (
              <EyeOff className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Eye className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-white/10 pt-5">
          <span className="text-sm text-ink-200">Account number</span>
          <span className="font-mono text-sm tabular text-white">
            {account ? formatAccountNumber(account.accountNumber) : "—"}
          </span>
          <button
            onClick={handleCopy}
            aria-label="Copy account number"
            className="ml-1 rounded-full p-1 text-ink-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
        <QuickAction href="/transfer" icon={ArrowLeftRight} label="Transfer" />
        <QuickAction icon={ArrowDownToLine} label="Deposit" onClick={() => setDepositOpen(true)} />
        <QuickAction href="/transfer?type=airtime" icon={Smartphone} label="Airtime" />
      </div>

      {/* Recent activity */}
      <div className="mt-9">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Recent activity</h2>
          <Link
            href="/history"
            className="flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            View all
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>

        <Card className="bg-white divide-y divide-ink-100">
          {isLoadingHistory ? (
            <div className="px-5 py-8 text-center text-sm text-ink-400">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-ink-400">No activity yet. Your transactions will appear here.</p>
            </div>
          ) : (
            recent.map((txn) => {
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
                    <p className="text-xs text-ink-400">{formatDate(txn.createdAt)}</p>
                  </div>
                  <p
                    className={`flex-shrink-0 font-mono text-sm tabular font-medium ${
                      meta.isCredit ? "text-success" : "text-ink-900"
                    }`}
                  >
                    {meta.sign}₦{parseFloat(txn.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              );
            })
          )}
        </Card>
      </div>

      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
    </AppShell>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href?: string;
  icon: typeof ArrowLeftRight;
  label: string;
  onClick?: () => void;
}) {
  const content = (
    <Card hoverable className="bg-white flex flex-col items-center gap-2.5 px-3 py-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-50 text-ink-900">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <span className="text-sm font-medium text-ink-900">{label}</span>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="block w-full">
      {content}
    </button>
  );
}
