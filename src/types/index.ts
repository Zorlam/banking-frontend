export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: string; // decimal string, e.g. "1000.50"
  currency: string;
}

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer_out"
  | "transfer_in"
  | "airtime";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  balanceAfter: string;
  counterpartyAccountNumber: string | null;
  counterpartyName: string | null;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  account: Account;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  field?: string;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  page: number;
  perPage: number;
  total: number;
}
