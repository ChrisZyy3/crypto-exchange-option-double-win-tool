'use client';

import { useEffect, useMemo, useState } from 'react';
import { OptionDirection, OptionMarket, OptionMarketResponse } from '@/lib/types';

interface UseOptionsDataResult {
  markets: OptionMarket[];
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
}

const CACHE_KEY = 'option-market-cache-v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

function readCache(direction?: OptionDirection): OptionMarketResponse | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { expires: number; payload: OptionMarketResponse; direction?: OptionDirection };
    if (Date.now() > parsed.expires) return null;
    if (direction && parsed.direction && parsed.direction !== direction) return null;
    return parsed.payload;
  } catch {
    return null;
  }
}

function writeCache(payload: OptionMarketResponse, direction?: OptionDirection) {
  if (typeof window === 'undefined') return;
  const entry = { expires: Date.now() + CACHE_TTL_MS, payload, direction };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
}

function createNonce() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as Crypto).randomUUID();
  return `${Date.now()}-${Math.random()}`;
}

export function useOptionsData(direction?: OptionDirection): UseOptionsDataResult {
  const [markets, setMarkets] = useState<OptionMarket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (direction) params.set('direction', direction);
    return params.toString() ? `?${params.toString()}` : '';
  }, [direction]);

  useEffect(() => {
    let active = true;
    const cached = readCache(direction);
    if (cached) {
      setMarkets(cached.markets);
      setUpdatedAt(cached.updatedAt);
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/options/markets${query}`, {
          headers: { 'x-request-nonce': createNonce() }
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const payload = (await res.json()) as OptionMarketResponse;
        if (!active) return;
        setMarkets(payload.markets);
        setUpdatedAt(payload.updatedAt);
        setError(null);
        writeCache(payload, direction);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Request failed';
        setError(message);
        const fallback = readCache(direction);
        if (fallback) {
          setMarkets(fallback.markets);
          setUpdatedAt(fallback.updatedAt);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [query]);

  return { markets, loading, error, updatedAt };
}
