import { useAppSelector } from '../store/hooks'
import { formatUSD, formatPercent, COIN_LABELS } from '../utils/format'

export function Header() {
  const coinId = useAppSelector((s) => s.chart.coinId)
  const priceData = useAppSelector((s) => s.prices.data[coinId])
  const label = COIN_LABELS[coinId]

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <img
        src="/bison-logo.png"
        alt="Bison logo"
        width={45}
        className="sm:hidden"
      />
      <h1 className="text-xl font-bold text-white sm:block hidden">
        Crypto Trading Dashboard
      </h1>
      <div className="flex items-center gap-3">
        {label && (
          <span className="text-gray-400 text-sm font-medium">
            {label.symbol}/USD
          </span>
        )}
        {priceData ? (
          <>
            <span className="text-white font-semibold text-lg">
              {formatUSD(priceData.usd)}
            </span>
            <span
              className={`text-sm font-medium px-2 py-0.5 rounded ${
                priceData.usd_24h_change >= 0
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-red-900/50 text-red-400'
              }`}
            >
              {formatPercent(priceData.usd_24h_change)}
            </span>
          </>
        ) : (
          <span className="text-gray-500 text-sm">Loading...</span>
        )}
      </div>
    </header>
  )
}
