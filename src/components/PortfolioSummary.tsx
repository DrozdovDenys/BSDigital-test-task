import {
  formatUSD,
  formatCrypto,
  formatPercent,
  COIN_LABELS,
} from "../utils/format";
import { usePortfolioSummary } from "../hooks/usePortfolioSummary";

export function PortfolioSummary() {
  const {
    items,
    cashBalance,
    totalValue,
    totalPnl,
    totalPnlPercent,
    holdings,
  } = usePortfolioSummary();

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h2 className="text-white font-semibold mb-3">Portfolio</h2>

      {/* Total value */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-white">
          {formatUSD(totalValue)}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-sm font-medium ${
              totalPnl >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {totalPnl >= 0 ? "+" : ""}
            {formatUSD(totalPnl)}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              totalPnl >= 0
                ? "bg-green-900/50 text-green-400"
                : "bg-red-900/50 text-red-400"
            }`}
          >
            {formatPercent(totalPnlPercent)}
          </span>
        </div>
      </div>

      {/* Cash */}
      <div className="flex justify-between items-center py-2 border-t border-gray-800">
        <span className="text-sm text-gray-400">Cash</span>
        <span className="text-sm text-white">{formatUSD(cashBalance)}</span>
      </div>

      {/* Holdings */}
      {items.map((item) => {
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
