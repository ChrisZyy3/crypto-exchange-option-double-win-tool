"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { AssetSymbol } from "@/components/options-data";

export interface IndexPriceSnapshot {
  symbol: string;
  price: number;
  timestamp: number;
}

interface UseBybitIndexPriceOptions {
  pollInterval?: number;
}

const symbolMap: Record<AssetSymbol, string> = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  BNB: "BNBUSDT"
};

export function useBybitIndexPrice(asset: AssetSymbol, options?: UseBybitIndexPriceOptions) {
  const pollInterval = options?.pollInterval ?? 5_000;
  const [data, setData] = useState<IndexPriceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const symbol = useMemo(() => symbolMap[asset], [asset]);

  useEffect(() => {
    let isMounted = true;

    const fetchPrice = async () => {
      setIsLoading(true);
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      try {
        const response = await fetch(`/api/bybit/index-price?symbol=${symbol}`, {
          signal: controllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json: IndexPriceSnapshot = await response.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setData(null);
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, pollInterval);

    return () => {
      isMounted = false;
      controllerRef.current?.abort();
      clearInterval(interval);
    };
  }, [symbol, pollInterval]);

  return {
    data,
    isLoading,
    error,
    symbol
  };
}
