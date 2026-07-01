import {
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { TransactionType } from "@/types";

interface TransactionMeta {
  label: string;
  icon: LucideIcon;
  sign: "+" | "-";
  isCredit: boolean;
}

export const transactionMeta: Record<TransactionType, TransactionMeta> = {
  deposit: { label: "Deposit", icon: Wallet, sign: "+", isCredit: true },
  withdrawal: { label: "Withdrawal", icon: ArrowUpRight, sign: "-", isCredit: false },
  transfer_in: { label: "Transfer received", icon: ArrowDownLeft, sign: "+", isCredit: true },
  transfer_out: { label: "Transfer sent", icon: ArrowUpRight, sign: "-", isCredit: false },
  airtime: { label: "Airtime top-up", icon: Smartphone, sign: "-", isCredit: false },
};
