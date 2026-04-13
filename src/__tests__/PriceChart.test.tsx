import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import pricesReducer from "../store/pricesSlice";
import chartReducer from "../store/chartSlice";
import portfolioReducer from "../store/portfolioSlice";
import { PriceChart } from "../components/PriceChart";

function makeStore(chartState?: Partial<ReturnType<typeof chartReducer>>) {
  return configureStore({
    reducer: {
      prices: pricesReducer,
      chart: chartReducer,
      portfolio: portfolioReducer,
    },
    preloadedState: chartState
      ? {
          chart: {
            coinId: "bitcoin",
            prices: [],
            loading: false,
            error: null,
            ...chartState,
          },
        }
      : undefined,
  });
}

describe("PriceChart", () => {
  it("shows loading state when no data", () => {
    const store = makeStore({ loading: true, prices: [] });
    render(
      <Provider store={store}>
        <PriceChart />
      </Provider>,
    );
    expect(screen.getByText("Loading chart data...")).toBeInTheDocument();
  });

  it("shows error message", () => {
    const store = makeStore({ error: "Network error", prices: [] });
    render(
      <Provider store={store}>
        <PriceChart />
      </Provider>,
    );
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it("renders chart with data", () => {
    const now = Date.now();
    const store = makeStore({
      prices: [
        [now - 3600000, 50000],
        [now - 1800000, 51000],
        [now, 52000],
      ],
    });
    render(
      <Provider store={store}>
        <PriceChart />
      </Provider>,
    );
    expect(screen.getByText("Bitcoin — 24h")).toBeInTheDocument();
  });
});
