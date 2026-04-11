import { useAppSelector } from "../store/hooks";
import {
  formatUSD,
  formatCrypto,
  formatDateTime,
  COIN_LABELS,
} from "../utils/format";

export function TransactionHistory() {
  const transactions = useAppSelector((s) => s.portfolio.transactions);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h2 className="text-white font-semibold mb-3">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-xs text-gray-600">No transactions yet.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {transactions.map((tx) => {
            const label = COIN_LABELS[tx.coinId];
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded ${
                      tx.type === "buy"
                        ? "bg-green-900/50 text-green-400"
                        : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {tx.type}
                  </span>
                  <div>
                    <div className="text-sm text-white">
                      {formatCrypto(tx.amount)} {label?.symbol ?? tx.coinId}
                    </div>
                    <div className="text-xs text-gray-500">
                      @ {formatUSD(tx.price)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">
                    {formatUSD(tx.amount * tx.price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(tx.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
