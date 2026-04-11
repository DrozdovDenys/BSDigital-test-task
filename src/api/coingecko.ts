import axios from "axios";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000,
});

export interface PriceData {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
}

export interface MarketChartData {
  prices: [number, number][];
}

export async function fetchPrices(ids: string[]): Promise<PriceData> {
  const { data } = await api.get<PriceData>("/simple/price", {
    params: {
      ids: ids.join(","),
      vs_currencies: "usd",
      include_24hr_change: true,
      include_last_updated_at: true,
    },
  });
  return data;
}

export async function fetchMarketChart(
  id: string,
  days = 1,
): Promise<MarketChartData> {
  const { data } = await api.get<MarketChartData>(
    `/coins/${encodeURIComponent(id)}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days,
      },
    },
  );
  return data;
}
