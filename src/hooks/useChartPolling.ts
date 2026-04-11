import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchChartData } from "../store/chartSlice";

const POLL_INTERVAL = 60_000;

export function useChartPolling() {
  const dispatch = useAppDispatch();
  const coinId = useAppSelector((s) => s.chart.coinId);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    dispatch(fetchChartData(coinId));

    intervalRef.current = setInterval(() => {
      dispatch(fetchChartData(coinId));
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, coinId]);
}
