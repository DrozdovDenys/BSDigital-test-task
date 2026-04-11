import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { fetchCryptoPrices } from "../store/pricesSlice";

const POLL_INTERVAL = 10_000;

export function usePricePolling() {
  const dispatch = useAppDispatch();
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    dispatch(fetchCryptoPrices());

    intervalRef.current = setInterval(() => {
      dispatch(fetchCryptoPrices());
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch]);
}
