import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "harvest" | "mint" | "approve";
  hash: string;
  poolId?: number;
  poolName?: string;
  tranche?: "senior" | "junior";
  amount: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            {
              ...tx,
              id: `${tx.hash}-${Date.now()}`,
              timestamp: Date.now(),
            },
            ...state.transactions,
          ].slice(0, 50), // Keep last 50 transactions
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: "otter-transactions",
    }
  )
);
