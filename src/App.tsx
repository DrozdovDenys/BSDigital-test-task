import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-gray-800 p-4 flex flex-col gap-4"></aside>

          {/* Main content */}
          <main className="flex-1 p-4 flex flex-col gap-4"></main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
