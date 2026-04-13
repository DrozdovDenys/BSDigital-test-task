import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchMarketChart } from '../api/binance'

export const fetchChartData = createAsyncThunk(
  'chart/fetch',
  async (coinId: string) => {
    const data = await fetchMarketChart(coinId, 1)
    return { coinId, prices: data.prices }
  }
)

interface ChartState {
  coinId: string
  prices: [number, number][]
  loading: boolean
  error: string | null
}

const initialState: ChartState = {
  coinId: 'bitcoin',
  prices: [],
  loading: false,
  error: null
}

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setSelectedCoin(state, action: { payload: string }) {
      state.coinId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false
        state.coinId = action.payload.coinId
        state.prices = action.payload.prices
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch chart data'
      })
  }
})

export const { setSelectedCoin } = chartSlice.actions
export default chartSlice.reducer
