import { configureStore } from "@reduxjs/toolkit";
import pricesReducer from "./pricesSlice";
import chartReducer from "./chartSlice";
import portfolioReducer from "./portfolioSlice";

export const store = configureStore({
  reducer: {
    prices: pricesReducer,
    chart: chartReducer,
    portfolio: portfolioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
