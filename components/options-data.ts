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
  BTC: 94001.12,
  ETH: 3320.45
};

export const optionMarkets: OptionMarketItem[] = [
  {
    id: "btc-low-94000-1d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 94000,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 376.86
  },
  {
    id: "btc-low-93000-1d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 93000,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 241.93
  },
  {
    id: "btc-low-92000-1d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 92000,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 180.25
  },
  {
    id: "btc-low-95000-3d",
    asset: "BTC",
    direction: "lowBuy",
    targetPrice: 95000,
    settlementDate: "2025-12-07 07:59",
    daysToSettlement: 3,
    apr: 148.55
  },
  {
    id: "btc-high-97000-1d",
    asset: "BTC",
    direction: "highSell",
    targetPrice: 97000,
    settlementDate: "2025-12-05 07:59",
    daysToSettlement: 1,
    apr: 210.42
  },
  {
    id: "btc-high-99000-3d",
    asset: "BTC",
    direction: "highSell",
    targetPrice: 99000,
    settlementDate: "2025-12-07 07:59",
    daysToSettlement: 3,
    apr: 156.13
  },
  {
    id: "btc-high-102000-7d",
    asset: "BTC",
    direction: "highSell",
    targetPrice: 102000,
    settlementDate: "2025-12-11 07:59",
    daysToSettlement: 7,
    apr: 120.37
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
