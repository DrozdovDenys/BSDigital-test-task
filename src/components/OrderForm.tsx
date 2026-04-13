import { formatUSD, formatCrypto } from "../utils/format";
import { useOrderForm } from "../hooks/useOrderForm";

export function OrderForm() {
  const {
    type,
    setType,
    usdAmount,
    setUsdAmount,
    feedback,
    setFeedback,
    price,
    coinAmount,
    label,
    cashBalance,
    holding,
    handleSubmit,
    coinId,
  } = useOrderForm();

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
