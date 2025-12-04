import { NextRequest, NextResponse } from 'next/server';
import { createOkxClient, enforceRateLimit, enforceReplayProtection, fetchOptionMarkets } from '@/lib/okx';
import { OptionDirection, OptionMarketResponse } from '@/lib/types';

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseDirection(value: string | null): OptionDirection | undefined {
  if (!value) return undefined;
  return value === 'low-buy' || value === 'high-sell' ? value : undefined;
}

export async function GET(request: NextRequest) {
  const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
  if (!enforceRateLimit(identifier)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const nonce = request.headers.get('x-request-nonce');
  if (!enforceReplayProtection(nonce)) {
    return NextResponse.json({ error: 'Invalid or repeated nonce' }, { status: 409 });
  }

  let direction: OptionDirection | undefined;
  let maxDays: number | undefined;

  try {
    const { searchParams } = new URL(request.url);
    direction = parseDirection(searchParams.get('direction'));
    const daysParam = searchParams.get('maxDays');
    if (daysParam) {
      const parsed = Number(daysParam);
      if (!Number.isNaN(parsed)) maxDays = parsed;
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const client = createOkxClient({
      apiKey: getEnv('OKX_API_KEY'),
      apiSecret: getEnv('OKX_API_SECRET'),
      passphrase: getEnv('OKX_API_PASSPHRASE')
    });

    const markets = await fetchOptionMarkets(client, direction, maxDays);
    const response: OptionMarketResponse = {
      markets,
      updatedAt: new Date().toISOString(),
      source: 'okx'
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load options';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
