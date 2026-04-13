# Crypto Trading Dashboard

A web-based crypto trading dashboard built with React, Redux Toolkit, and Recharts. View real-time prices, analyze 24-hour trends with charts, and simulate market orders for popular cryptocurrencies.

## Features

- **Real-time prices** — Live crypto prices updated every 10 seconds via CoinGecko API
- **Price charts** — Interactive 24-hour price charts with Recharts
- **Mock trading** — Simulate buy/sell market orders for BTC, ETH, SOL
- **Portfolio tracking** — View holdings, cash balance, and profit/loss calculations
- **Transaction history** — Full log of all simulated trades
- **Persistent state** — Portfolio data saved to localStorage across sessions
- **Responsive design** — Desktop two-column layout, single column on mobile
- **Error handling** — Graceful handling of API failures with error boundaries

## Tech Stack

- **React 19** with hooks
- **Redux Toolkit** for state management
- **Recharts** for charting
- **Tailwind CSS v4** for styling
- **Axios** for HTTP requests
- **Vitest** + **React Testing Library** for testing
- **Vite 8** for development and builds
- **TypeScript 6**

## Setup & Running

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests

```bash
npm run test        # watch mode
npm run test:run    # single run
```

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── api/              # CoinGecko API client
├── components/       # React UI components
│   ├── CoinSelector  # Coin list with live prices
│   ├── ErrorBoundary # Error fallback UI
│   ├── Header        # App header with price ticker
│   ├── OrderForm     # Buy/sell trading form
│   ├── PortfolioSummary # Holdings & P/L overview
│   ├── PriceChart    # 24h line chart (Recharts)
│   └── TransactionHistory # Trade log
├── hooks/            # Custom hooks (price/chart polling)
├── store/            # Redux store & slices
│   ├── chartSlice    # Chart data state
│   ├── portfolioSlice # Portfolio, trades, localStorage persistence
│   └── pricesSlice   # Live price data
├── utils/            # Formatting helpers
├── __tests__/        # Unit tests
├── App.tsx           # Main dashboard layout
└── main.tsx          # Entry point with Redux Provider
```

## API

Uses the free [CoinGecko API](https://www.coingecko.com/en/api):

- `GET /simple/price` — current prices (polled every 10s)
- `GET /coins/{id}/market_chart` — 24h price history (polled every 60s)

## Performance Optimizations

- Memoized portfolio calculations with `useMemo`
- Separate polling intervals: 10s for prices, 60s for chart data
