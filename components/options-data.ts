export type AssetSymbol = "BTC" | "ETH";
export type OptionDirection = "lowBuy" | "highSell";

export interface OptionProduct {
  asset: AssetSymbol;
  type: "call" | "put";
  strike: number;
  expiryLabel: string;
  apr: number;
  markPrice: number;
  daysToExpiry: number;
  payoffDescription: string;
}

export interface OptionMarketItem {
  id: string;
  asset: AssetSymbol;
  direction: OptionDirection;
  targetPrice: number;
  settlementDate: string;
  daysToSettlement: number;
  apr: number;
}

export const assetSpotPrice: Record<AssetSymbol, number> = {
  BTC: 61280,
  ETH: 3320
};

export const optionMarkets: OptionMarketItem[] = [
  {
    id: "btc-low-60000-1d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 60000,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 82.15
  },
  {
    id: "btc-low-59500-1d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 59500,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 68.74
  },
  {
    id: "btc-low-59000-1d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 59000,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 55.42
  },
  {
    id: "btc-low-60500-3d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 60500,
    settlementDate: "2025-12-07 07:59",
    daysToSettlement: 3,
    apr: 44.91
  },
  {
    id: "btc-high-62500-1d",
    asset: "BTC",
    direction: "highSell",
    targetPrice: 62500,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 91.62
  },
  {
    id: "btc-high-64000-3d",
    asset: "BTC",
    direction: "highSell",
    targetPrice: 64000,
    settlementDate: "2025-12-07 07:59",
    daysToSettlement: 3,
    apr: 72.48
  },
  {
    id: "btc-high-66000-7d",
    asset: "BTC",
    direction: "highSell",
    targetPrice: 66000,
    settlementDate: "2025-12-11 07:59",
    daysToSettlement: 7,
    apr: 58.12
  },
  {
    id: "eth-low-3200-1d",
    asset: "ETH",
    direction: "lowBuy",
    targetPrice: 3200,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 285.14
  },
  {
    id: "eth-low-3100-3d",
    asset: "ETH",
    direction: "lowBuy",
    targetPrice: 3100,
    settlementDate: "2025-12-07 07:59",
    daysToSettlement: 3,
    apr: 190.12
  },
  {
    id: "eth-low-3000-7d",
    asset: "ETH",
    direction: "lowBuy",
    targetPrice: 3000,
    settlementDate: "2025-12-11 07:59",
    daysToSettlement: 7,
    apr: 150.32
  },
  {
    id: "eth-high-3450-1d",
    asset: "ETH",
    direction: "highSell",
    targetPrice: 3450,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 198.42
  },
  {
    id: "eth-high-3600-3d",
    asset: "ETH",
    direction: "highSell",
    targetPrice: 3600,
    settlementDate: "2025-12-07 07:59",
    daysToSettlement: 3,
    apr: 165.75
  },
  {
    id: "eth-high-3800-7d",
    asset: "ETH",
    direction: "highSell",
    targetPrice: 3800,
    settlementDate: "2025-12-11 07:59",
    daysToSettlement: 7,
    apr: 128.9
  }
];
