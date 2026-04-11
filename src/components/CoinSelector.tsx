import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setSelectedCoin } from "../store/chartSlice";
import { formatUSD, formatPercent, COIN_LABELS } from "../utils/format";

const COINS = Object.keys(COIN_LABELS);

export function CoinSelector() {
  const dispatch = useAppDispatch();
  const selectedCoin = useAppSelector((s) => s.chart.coinId);
  const prices = useAppSelector((s) => s.prices.data);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">
        Markets
      </h2>
      {COINS.map((coinId) => {
        const label = COIN_LABELS[coinId];
        const price = prices[coinId];
        const isSelected = coinId === selectedCoin;

        return (
          <button
            key={coinId}
            onClick={() => dispatch(setSelectedCoin(coinId))}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
              isSelected
                ? "bg-blue-600/20 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <div>
              <div className="font-medium text-sm">{label.name}</div>
              <div className="text-xs text-gray-500">{label.symbol}</div>
            </div>
            <div className="text-right">
              {price ? (
                <>
                  <div className="text-sm font-medium">
                    {formatUSD(price.usd)}
                  </div>
                  <div
                    className={`text-xs ${
                      price.usd_24h_change >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatPercent(price.usd_24h_change)}
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-600">—</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
