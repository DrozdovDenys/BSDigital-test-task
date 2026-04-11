import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { executeTrade } from "../store/portfolioSlice";
import { formatUSD, formatCrypto, COIN_LABELS } from "../utils/format";

export function OrderForm() {
  const dispatch = useAppDispatch();
  const coinId = useAppSelector((s) => s.chart.coinId);
  const priceData = useAppSelector((s) => s.prices.data[coinId]);
  const cashBalance = useAppSelector((s) => s.portfolio.cashBalance);
  const holding = useAppSelector((s) =>
    s.portfolio.holdings.find((h) => h.coinId === coinId),
  );

  const [type, setType] = useState<"buy" | "sell">("buy");
  const [usdAmount, setUsdAmount] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const price = priceData?.usd ?? 0;
  const coinAmount = price > 0 ? parseFloat(usdAmount || "0") / price : 0;
  const label = COIN_LABELS[coinId];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const usd = parseFloat(usdAmount);
    if (!usd || usd <= 0 || price <= 0) {
      setFeedback({ type: "error", message: "Enter a valid amount" });
      return;
    }

    const amount = usd / price;

    if (type === "buy" && usd > cashBalance) {
      setFeedback({ type: "error", message: "Insufficient cash balance" });
      return;
    }

    if (type === "sell" && (!holding || holding.amount < amount)) {
      setFeedback({ type: "error", message: "Insufficient holdings" });
      return;
    }

    dispatch(executeTrade({ coinId, type, amount, price }));
    setUsdAmount("");
    setFeedback({
      type: "success",
      message: `${type === "buy" ? "Bought" : "Sold"} ${formatCrypto(amount)} ${label?.symbol ?? coinId} for ${formatUSD(usd)}`,
    });
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h2 className="text-white font-semibold mb-3">
        Trade {label?.symbol ?? coinId}
      </h2>

      {/* Buy/Sell Toggle */}
      <div className="flex mb-4 rounded-lg overflow-hidden border border-gray-700">
        <button
          type="button"
          onClick={() => {
            setType("buy");
            setFeedback(null);
          }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            type === "buy"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => {
            setType("sell");
            setFeedback(null);
          }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            type === "sell"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Price display */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price</span>
          <span className="text-white">
            {price > 0 ? formatUSD(price) : "—"}
          </span>
        </div>

        {/* Amount input */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            Amount (USD)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Estimated coin amount */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Est. {label?.symbol ?? ""}</span>
          <span className="text-white">{formatCrypto(coinAmount)}</span>
        </div>

        {/* Available balance */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{type === "buy" ? "Cash Available" : "Holdings"}</span>
          <span>
            {type === "buy"
              ? formatUSD(cashBalance)
              : `${formatCrypto(holding?.amount ?? 0)} ${label?.symbol ?? ""}`}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!price}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 ${
            type === "buy"
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
        >
          {type === "buy" ? "Buy" : "Sell"} {label?.symbol ?? coinId}
        </button>
      </form>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mt-3 text-xs px-3 py-2 rounded-lg ${
            feedback.type === "success"
              ? "bg-green-900/30 text-green-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
