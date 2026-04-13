import { useMemo } from "react";
import { useAppSelector } from "../store/hooks";
import type { Holding } from "../store/portfolioSlice";

export interface PortfolioItem {
  coinId: string;
  amount: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface PortfolioSummary {
  items: PortfolioItem[];
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  cashBalance: number;
  holdings: Holding[];
}

const INITIAL_BALANCE = 10_000;

export function usePortfolioSummary(): PortfolioSummary {
  const cashBalance = useAppSelector((s) => s.portfolio.cashBalance);
  const holdings = useAppSelector((s) => s.portfolio.holdings);
  const prices = useAppSelector((s) => s.prices.data);

  return useMemo(() => {
    const items = holdings.map((h): PortfolioItem => {
      const currentPrice = prices[h.coinId]?.usd ?? 0;
      const currentValue = h.amount * currentPrice;
      const costValue = h.amount * h.avgCostBasis;
      const pnl = currentValue - costValue;
      const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;

      return {
        coinId: h.coinId,
        amount: h.amount,
        avgCost: h.avgCostBasis,
        currentPrice,
        currentValue,
        pnl,
        pnlPercent,
      };
    });

    const holdingsValue = items.reduce((sum, i) => sum + i.currentValue, 0);
    const totalValue = cashBalance + holdingsValue;
    const totalPnl = totalValue - INITIAL_BALANCE;
    const totalPnlPercent = (totalPnl / INITIAL_BALANCE) * 100;

    return {
      items,
      totalValue,
      totalPnl,
      totalPnlPercent,
      cashBalance,
      holdings,
    };
  }, [holdings, prices, cashBalance]);
}
