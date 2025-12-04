export type OptionDirection = 'low-buy' | 'high-sell';

export interface OptionMarket {
  asset: 'BTC' | 'ETH';
  direction: OptionDirection;
  targetPrice: number;
  settlementDate: string;
  daysToSettlement: number;
  apr: number;
}

export interface OptionMarketResponse {
  markets: OptionMarket[];
  updatedAt: string;
  source: string;
}
