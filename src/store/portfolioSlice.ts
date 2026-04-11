import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Holding {
  coinId: string;
  amount: number;
  avgCostBasis: number;
}

export interface Transaction {
  id: string;
  coinId: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: number;
}

interface PortfolioState {
  cashBalance: number;
  holdings: Holding[];
  transactions: Transaction[];
}

const STORAGE_KEY = "crypto-dashboard-portfolio";

function loadState(): PortfolioState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PortfolioState;
  } catch {
    // ignore
  }
  return { cashBalance: 10000, holdings: [], transactions: [] };
}

function saveState(state: PortfolioState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const initialState: PortfolioState = loadState();

interface TradePayload {
  coinId: string;
  type: "buy" | "sell";
  amount: number; // coin amount
  price: number; // current USD price per coin
}

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    executeTrade(state, action: PayloadAction<TradePayload>) {
      const { coinId, type, amount, price } = action.payload;
      const cost = amount * price;

      if (type === "buy") {
        if (cost > state.cashBalance) return; // insufficient funds
        state.cashBalance -= cost;

        const existing = state.holdings.find((h) => h.coinId === coinId);
        if (existing) {
          const totalCost = existing.avgCostBasis * existing.amount + cost;
          existing.amount += amount;
          existing.avgCostBasis = totalCost / existing.amount;
        } else {
          state.holdings.push({ coinId, amount, avgCostBasis: price });
        }
      } else {
        const existing = state.holdings.find((h) => h.coinId === coinId);
        if (!existing || existing.amount < amount) return; // insufficient holdings

        state.cashBalance += cost;
        existing.amount -= amount;
        if (existing.amount < 0.00000001) {
          state.holdings = state.holdings.filter((h) => h.coinId !== coinId);
        }
      }

      state.transactions.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        coinId,
        type,
        amount,
        price,
        timestamp: Date.now(),
      });

      saveState(state);
    },
    resetPortfolio(state) {
      state.cashBalance = 10000;
      state.holdings = [];
      state.transactions = [];
      saveState(state);
    },
  },
});

export const { executeTrade, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
