import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchPrices, type PriceData } from '../api/coingecko'

const SUPPORTED_COINS = ['bitcoin', 'ethereum', 'solana']

export const fetchCryptoPrices = createAsyncThunk('prices/fetch', async () => {
  return await fetchPrices(SUPPORTED_COINS)
})

interface PricesState {
  data: PriceData
  loading: boolean
  error: string | null
}

const initialState: PricesState = {
  data: {},
  loading: false,
  error: null
}

const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoPrices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoPrices.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchCryptoPrices.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch prices'
      })
  }
})

export default pricesSlice.reducer
