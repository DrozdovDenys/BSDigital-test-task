import { ErrorBoundary } from './components/ErrorBoundary'
import { Header } from './components/Header'
import { CoinSelector } from './components/CoinSelector'
import { PriceChart } from './components/PriceChart'
import { OrderForm } from './components/OrderForm'
import { PortfolioSummary } from './components/PortfolioSummary'
import { usePricePolling } from './hooks/usePricePolling'
import { useChartPolling } from './hooks/useChartPolling'
import { TransactionHistory } from './components/TransactionHistory'

function App() {
  usePricePolling()
  useChartPolling()

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-gray-800 p-4 flex flex-col gap-4">
            <CoinSelector />
            <PortfolioSummary />
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 flex flex-col gap-4">
            <PriceChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <OrderForm />
              <TransactionHistory />
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
