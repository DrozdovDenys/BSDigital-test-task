import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAppSelector } from "../store/hooks";
import { formatUSD, formatTime, COIN_LABELS } from "../utils/format";

export function PriceChart() {
  const { prices, loading, error, coinId } = useAppSelector((s) => s.chart);
  const label = COIN_LABELS[coinId];

  const chartData = prices.map(([timestamp, price]) => ({
    time: timestamp,
    price,
  }));

  if (error) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-900 rounded-xl border border-gray-800">
        <p className="text-red-400 text-sm">Failed to load chart: {error}</p>
      </div>
    );
  }

  if (loading && chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-900 rounded-xl border border-gray-800 animate-pulse">
        <p className="text-gray-500 text-sm">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">
          {label?.name ?? coinId} — 24h
        </h2>
        {loading && (
          <span className="text-xs text-gray-500">Refreshing...</span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            minTickGap={40}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => formatUSD(v)}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelFormatter={(label) =>
              new Date(label as number).toLocaleString()
            }
            formatter={(value) => [formatUSD(value as number), "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
