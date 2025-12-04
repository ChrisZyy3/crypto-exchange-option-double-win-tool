import crypto from 'crypto';
import { OptionDirection, OptionMarket } from './types';

const BASE_URL = 'https://www.okx.com';

interface OkxClientConfig {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const REPLAY_WINDOW_MS = 5 * 60_000;

const rateLimitBucket = new Map<string, { count: number; windowStart: number }>();
const replayGuard = new Map<string, number>();

function cleanReplayGuard(now: number) {
  for (const [key, ts] of replayGuard.entries()) {
    if (now - ts > REPLAY_WINDOW_MS) {
      replayGuard.delete(key);
    }
  }
}

export function enforceRateLimit(identifier: string): boolean {
  const now = Date.now();
  const current = rateLimitBucket.get(identifier) ?? { count: 0, windowStart: now };
  if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    current.windowStart = now;
    current.count = 0;
  }
  current.count += 1;
  rateLimitBucket.set(identifier, current);
  return current.count <= RATE_LIMIT_MAX;
}

export function enforceReplayProtection(nonce: string | null): boolean {
  if (!nonce) return false;
  const now = Date.now();
  cleanReplayGuard(now);
  if (replayGuard.has(nonce)) {
    return false;
  }
  replayGuard.set(nonce, now);
  return true;
}

export function createOkxClient(config: OkxClientConfig) {
  async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(path, BASE_URL);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const timestamp = new Date().toISOString();
    const method = 'GET';
    const requestPath = url.pathname + (url.search ? url.search : '');
    const prehash = `${timestamp}${method}${requestPath}`;
    const sign = crypto.createHmac('sha256', config.apiSecret).update(prehash).digest('base64');

    const headers: Record<string, string> = {
      'OK-ACCESS-KEY': config.apiKey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': config.passphrase
    };

    const res = await fetch(url.toString(), {
      method,
      headers,
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OKX request failed (${res.status}): ${text}`);
    }

    return (await res.json()) as T;
  }

  return { get };
}

interface RawTicker {
  instId: string;
  last?: string;
  askPx?: string;
  bidPx?: string;
}

interface MarketTickerResponse {
  code: string;
  data: RawTicker[];
}

interface IndexTickerResponse {
  data: { idxPx?: string }[];
}

function parseInstrument(instId: string) {
  const [underlying, currency, expiry, strike, optionType] = instId.split('-');
  if (!underlying || !currency || !expiry || !strike || !optionType) return null;
  const settlement = new Date(`${expiry.slice(0, 4)}-${expiry.slice(4, 6)}-${expiry.slice(6, 8)}T08:00:00.000Z`);
  const targetPrice = Number(strike);
  const direction: OptionDirection = optionType === 'P' ? 'low-buy' : 'high-sell';
  return { asset: underlying as 'BTC' | 'ETH', settlement, targetPrice, direction };
}

function derivePrice(ticker: RawTicker) {
  const prices = [ticker.last, ticker.askPx, ticker.bidPx].filter(Boolean).map(Number);
  return prices.find((p) => Number.isFinite(p)) ?? 0;
}

export async function fetchOptionMarkets(
  client: ReturnType<typeof createOkxClient>,
  directionFilter?: OptionDirection,
  maxDays?: number
): Promise<OptionMarket[]> {
  const now = Date.now();

  const assets: Array<'BTC' | 'ETH'> = ['BTC', 'ETH'];
  const requests = assets.map(async (asset) => {
    const uly = `${asset}-USD`;
    const [tickersRes, indexRes] = await Promise.all([
      client.get<MarketTickerResponse>('/api/v5/market/tickers', {
        instType: 'OPTION',
        uly
      }),
      client.get<IndexTickerResponse>('/api/v5/market/index-tickers', {
        instId: uly
      })
    ]);

    const indexPrice = Number(indexRes?.data?.[0]?.idxPx ?? 0);

    return tickersRes.data
      .map((ticker) => {
        const parsed = parseInstrument(ticker.instId);
        if (!parsed) return null;
        if (directionFilter && parsed.direction !== directionFilter) return null;

        const isLowBuyCandidate = parsed.direction === 'low-buy' && (indexPrice === 0 || parsed.targetPrice <= indexPrice);
        const isHighSellCandidate = parsed.direction === 'high-sell' && (indexPrice === 0 || parsed.targetPrice >= indexPrice);
        if (!isLowBuyCandidate && !isHighSellCandidate) return null;

        const daysToSettlement = Math.max(0, Math.round((parsed.settlement.getTime() - now) / (24 * 60 * 60 * 1000)));
        if (maxDays !== undefined && daysToSettlement > maxDays) return null;

        const premium = derivePrice(ticker);
        const apr = parsed.targetPrice > 0 && daysToSettlement > 0
          ? (premium / parsed.targetPrice) * (365 / daysToSettlement) * 100
          : 0;

        return {
          asset: parsed.asset,
          direction: parsed.direction,
          targetPrice: parsed.targetPrice,
          settlementDate: parsed.settlement.toISOString(),
          daysToSettlement,
          apr: Number(apr.toFixed(2))
        } as OptionMarket;
      })
      .filter((entry): entry is OptionMarket => Boolean(entry));
  });

  const flattened = (await Promise.all(requests)).flat();
  return flattened;
}
