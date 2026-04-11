import { useMemo } from "react";
import { useAppSelector } from "../store/hooks";
import {
  formatUSD,
  formatCrypto,
  formatPercent,
  COIN_LABELS,
} from "../utils/format";

export function PortfolioSummary() {
  const cashBalance = useAppSelector((s) => s.portfolio.cashBalance);
  const holdings = useAppSelector((s) => s.portfolio.holdings);
  const prices = useAppSelector((s) => s.prices.data);

  const summary = useMemo(() => {
    const items = holdings.map((h) => {
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
    const totalPnl = totalValue - 10000;
    const totalPnlPercent = (totalPnl / 10000) * 100;

    return { items, totalValue, totalPnl, totalPnlPercent };
  }, [holdings, prices, cashBalance]);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h2 className="text-white font-semibold mb-3">Portfolio</h2>

      {/* Total value */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-white">
          {formatUSD(summary.totalValue)}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-sm font-medium ${
              summary.totalPnl >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {summary.totalPnl >= 0 ? "+" : ""}
            {formatUSD(summary.totalPnl)}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              summary.totalPnl >= 0
                ? "bg-green-900/50 text-green-400"
                : "bg-red-900/50 text-red-400"
            }`}
          >
            {formatPercent(summary.totalPnlPercent)}
          </span>
        </div>
      </div>

      {/* Cash */}
      <div className="flex justify-between items-center py-2 border-t border-gray-800">
        <span className="text-sm text-gray-400">Cash</span>
        <span className="text-sm text-white">{formatUSD(cashBalance)}</span>
      </div>

      {/* Holdings */}
      {summary.items.map((item) => {
        const label = COIN_LABELS[item.coinId];
        return (
          <div
            key={item.coinId}
            className="flex justify-between items-center py-2 border-t border-gray-800"
          >
            <div>
              <div className="text-sm text-white">
                {label?.symbol ?? item.coinId}
              </div>
              <div className="text-xs text-gray-500">
                {formatCrypto(item.amount)} @ {formatUSD(item.avgCost)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white">
                {formatUSD(item.currentValue)}
              </div>
              <div
                className={`text-xs ${
                  item.pnl >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.pnl >= 0 ? "+" : ""}
                {formatUSD(item.pnl)}
              </div>
            </div>
          </div>
        );
      })}

      {holdings.length === 0 && (
        <p className="text-xs text-gray-600 py-2 border-t border-gray-800">
          No holdings yet. Make a trade to get started.
        </p>
      )}
    </div>
  );
}
