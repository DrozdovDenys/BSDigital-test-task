import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import pricesReducer from "../store/pricesSlice";
import chartReducer from "../store/chartSlice";
import portfolioReducer from "../store/portfolioSlice";
import { OrderForm } from "../components/OrderForm";

function makeStore() {
  return configureStore({
    reducer: {
      prices: pricesReducer,
      chart: chartReducer,
      portfolio: portfolioReducer,
    },
    preloadedState: {
      prices: {
        data: {
          bitcoin: {
            usd: 50000,
            usd_24h_change: 2.5,
            last_updated_at: Date.now(),
          },
        },
        loading: false,
        error: null,
      },
      chart: {
        coinId: "bitcoin",
        prices: [],
        loading: false,
        error: null,
      },
      portfolio: {
        cashBalance: 10000,
        holdings: [],
        transactions: [],
      },
    },
  });
}

describe("OrderForm", () => {
  it("renders buy form by default", () => {
    render(
      <Provider store={makeStore()}>
        <OrderForm />
      </Provider>,
    );
    expect(screen.getByText("Trade BTC")).toBeInTheDocument();
    expect(screen.getByText("Buy BTC")).toBeInTheDocument();
  });

  it("switches to sell mode", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={makeStore()}>
        <OrderForm />
      </Provider>,
    );
    await user.click(screen.getByText("Sell"));
    expect(screen.getByText("Sell BTC")).toBeInTheDocument();
  });

  it("shows error for insufficient cash", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={makeStore()}>
        <OrderForm />
      </Provider>,
    );
    const input = screen.getByPlaceholderText("0.00");
    await user.type(input, "999999");
    await user.click(screen.getByText("Buy BTC"));
    expect(screen.getByText("Insufficient cash balance")).toBeInTheDocument();
  });

  it("executes a buy trade successfully", async () => {
    const user = userEvent.setup();
    const store = makeStore();
    render(
      <Provider store={store}>
        <OrderForm />
      </Provider>,
    );
    const input = screen.getByPlaceholderText("0.00");
    await user.type(input, "1000");
    await user.click(screen.getByText("Buy BTC"));
    expect(screen.getByText(/Bought/)).toBeInTheDocument();
    expect(store.getState().portfolio.cashBalance).toBe(9000);
  });
});
