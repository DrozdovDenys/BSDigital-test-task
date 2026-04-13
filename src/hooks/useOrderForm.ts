import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { executeTrade } from "../store/portfolioSlice";
import { formatUSD, formatCrypto, COIN_LABELS } from "../utils/format";

export function useOrderForm() {
  const dispatch = useAppDispatch();
  const coinId = useAppSelector((s) => s.chart.coinId);
  const priceData = useAppSelector((s) => s.prices.data[coinId]);
  const cashBalance = useAppSelector((s) => s.portfolio.cashBalance);
  const holding = useAppSelector((s) =>
    s.portfolio.holdings.find((h) => h.coinId === coinId)
  );
  const label = COIN_LABELS[coinId];

  const [type, setType] = useState<"buy" | "sell">("buy");
  const [usdAmount, setUsdAmount] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const price = priceData?.usd ?? 0;
  const coinAmount = price > 0 ? parseFloat(usdAmount || "0") / price : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const usd = parseFloat(usdAmount);
    if (!usd || usd <= 0 || price <= 0) {
      setFeedback({ type: "error", message: "Enter a valid amount" });
      return;
    }
    const amount = usd / price;
    if (type === "buy" && usd > cashBalance) {
      setFeedback({ type: "error", message: "Insufficient cash balance" });
      return;
    }
    if (type === "sell" && (!holding || holding.amount < amount)) {
      setFeedback({ type: "error", message: "Insufficient holdings" });
      return;
    }
    dispatch(executeTrade({ coinId, type, amount, price }));
    setUsdAmount("");
    setFeedback({
      type: "success",
      message: `${type === "buy" ? "Bought" : "Sold"} ${formatCrypto(amount)} ${
        label?.symbol ?? coinId
      } for ${formatUSD(usd)}`,
    });
  }

  return {
    type,
    setType,
    usdAmount,
    setUsdAmount,
    feedback,
    setFeedback,
    price,
    coinAmount,
    label,
    cashBalance,
    holding,
    handleSubmit,
    coinId,
  };
}
