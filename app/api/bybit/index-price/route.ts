import { NextRequest, NextResponse } from "next/server";

interface IndexPriceResponse {
  symbol: string;
  price: number;
  timestamp: number;
}

const SUPPORTED_SYMBOLS = new Set(["BTCUSDT", "ETHUSDT"]);
const API_ENDPOINT = "https://api.bybit.com/v5/market/tickers";

// Simple in-memory cache to avoid hammering the upstream endpoint when users poll aggressively.
const cache: Record<string, { timestamp: number; payload: IndexPriceResponse }> = {};
const CACHE_TTL_MS = 3_000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();

  if (!symbol || !SUPPORTED_SYMBOLS.has(symbol)) {
    return NextResponse.json(
      { error: "Unsupported or missing symbol. Try BTCUSDT or ETHUSDT." },
      { status: 400 }
    );
  }

  const now = Date.now();
  const cached = cache[symbol];
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload);
  }

  try {
    const upstreamResponse = await fetch(`${API_ENDPOINT}?category=linear&symbol=${symbol}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    if (!upstreamResponse.ok) {
      throw new Error(`Upstream error ${upstreamResponse.status}`);
    }

    const json = await upstreamResponse.json();
    const ticker = json?.result?.list?.[0];
    const price = ticker?.indexPrice ? Number(ticker.indexPrice) : undefined;
    const timestamp = typeof json?.time === "number" ? json.time : Date.now();

    if (!price || Number.isNaN(price)) {
      throw new Error("Malformed upstream response");
    }

    const payload: IndexPriceResponse = { symbol, price, timestamp };
    cache[symbol] = { timestamp: now, payload };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Failed to fetch Bybit index price", error);
    return NextResponse.json({ error: "Unable to fetch index price" }, { status: 502 });
  }
}
