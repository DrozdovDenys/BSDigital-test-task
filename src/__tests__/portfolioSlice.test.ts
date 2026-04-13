import { describe, it, expect } from "vitest";
import portfolioReducer, {
  executeTrade,
  resetPortfolio,
} from "../store/portfolioSlice";

const emptyState = {
  cashBalance: 10000,
  holdings: [],
  transactions: [],
};

describe("portfolioSlice", () => {
  it("handles a buy trade", () => {
    const action = executeTrade({
      coinId: "bitcoin",
      type: "buy",
      amount: 0.1,
      price: 50000,
    });
    const state = portfolioReducer(emptyState, action);

    expect(state.cashBalance).toBe(5000);
    expect(state.holdings).toHaveLength(1);
    expect(state.holdings[0].coinId).toBe("bitcoin");
    expect(state.holdings[0].amount).toBe(0.1);
    expect(state.holdings[0].avgCostBasis).toBe(50000);
    expect(state.transactions).toHaveLength(1);
    expect(state.transactions[0].type).toBe("buy");
  });

  it("averages cost basis on multiple buys", () => {
    let state = portfolioReducer(
      emptyState,
      executeTrade({
        coinId: "bitcoin",
        type: "buy",
        amount: 0.1,
        price: 40000,
      }),
    );
    state = portfolioReducer(
      state,
      executeTrade({
        coinId: "bitcoin",
        type: "buy",
        amount: 0.1,
        price: 60000,
      }),
    );

    expect(state.holdings[0].amount).toBe(0.2);
    expect(state.holdings[0].avgCostBasis).toBe(50000);
  });

  it("rejects buy when insufficient cash", () => {
    const action = executeTrade({
      coinId: "bitcoin",
      type: "buy",
      amount: 1,
      price: 999999,
    });
    const state = portfolioReducer(emptyState, action);

    expect(state.cashBalance).toBe(10000);
    expect(state.holdings).toHaveLength(0);
    expect(state.transactions).toHaveLength(0);
  });

  it("handles a sell trade", () => {
    const stateWithHolding = {
      cashBalance: 5000,
      holdings: [{ coinId: "bitcoin", amount: 0.1, avgCostBasis: 50000 }],
      transactions: [],
    };
    const action = executeTrade({
      coinId: "bitcoin",
      type: "sell",
      amount: 0.05,
      price: 60000,
    });
    const state = portfolioReducer(stateWithHolding, action);

    expect(state.cashBalance).toBe(8000);
    expect(state.holdings[0].amount).toBeCloseTo(0.05);
    expect(state.transactions).toHaveLength(1);
    expect(state.transactions[0].type).toBe("sell");
  });

  it("removes holding when selling all", () => {
    const stateWithHolding = {
      cashBalance: 5000,
      holdings: [{ coinId: "bitcoin", amount: 0.1, avgCostBasis: 50000 }],
      transactions: [],
    };
    const action = executeTrade({
      coinId: "bitcoin",
      type: "sell",
      amount: 0.1,
      price: 60000,
    });
    const state = portfolioReducer(stateWithHolding, action);

    expect(state.holdings).toHaveLength(0);
    expect(state.cashBalance).toBe(11000);
  });

  it("rejects sell when insufficient holdings", () => {
    const action = executeTrade({
      coinId: "bitcoin",
      type: "sell",
      amount: 1,
      price: 50000,
    });
    const state = portfolioReducer(emptyState, action);

    expect(state.cashBalance).toBe(10000);
    expect(state.transactions).toHaveLength(0);
  });

  it("resets portfolio to initial state", () => {
    const traded = {
      cashBalance: 5000,
      holdings: [{ coinId: "bitcoin", amount: 0.1, avgCostBasis: 50000 }],
      transactions: [
        {
          id: "1",
          coinId: "bitcoin",
          type: "buy" as const,
          amount: 0.1,
          price: 50000,
          timestamp: Date.now(),
        },
      ],
    };
    const state = portfolioReducer(traded, resetPortfolio());

    expect(state.cashBalance).toBe(10000);
    expect(state.holdings).toHaveLength(0);
    expect(state.transactions).toHaveLength(0);
  });
});
