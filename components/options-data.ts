export type AssetSymbol = "BTC" | "ETH";
export type OptionType = "call" | "put";

export interface OptionProduct {
  id: string;
  asset: AssetSymbol;
  strike: number;
  daysToExpiry: number;
  expiryLabel: string;
  apr: number;
  markPrice: number;
  payoffDescription: string;
  type: OptionType;
}

export const optionProducts: OptionProduct[] = [
  {
    id: "btc-1w-60000-call",
    asset: "BTC",
    strike: 60000,
    daysToExpiry: 7,
    expiryLabel: "7 天后到期",
    apr: 11.8,
    markPrice: 61280,
    payoffDescription: "到期价 \u2265 60,000 USDT 自动买入或获利",
    type: "call"
  },
  {
    id: "btc-2w-62000-call",
    asset: "BTC",
    strike: 62000,
    daysToExpiry: 14,
    expiryLabel: "14 天后到期",
    apr: 13.2,
    markPrice: 61280,
    payoffDescription: "到期价 \u2265 62,000 USDT 获得行权收益",
    type: "call"
  },
  {
    id: "btc-1m-64000-call",
    asset: "BTC",
    strike: 64000,
    daysToExpiry: 30,
    expiryLabel: "30 天后到期",
    apr: 15.1,
    markPrice: 61280,
    payoffDescription: "更高行权价换取更高 APR",
    type: "call"
  },
  {
    id: "eth-1w-3200-call",
    asset: "ETH",
    strike: 3200,
    daysToExpiry: 7,
    expiryLabel: "7 天后到期",
    apr: 9.6,
    markPrice: 3320,
    payoffDescription: "到期价 \u2265 3,200 USDT 自动买入或获利",
    type: "call"
  },
  {
    id: "eth-2w-3400-call",
    asset: "ETH",
    strike: 3400,
    daysToExpiry: 14,
    expiryLabel: "14 天后到期",
    apr: 11.4,
    markPrice: 3320,
    payoffDescription: "到期价 \u2265 3,400 USDT 获得行权收益",
    type: "call"
  },
  {
    id: "eth-1m-3600-call",
    asset: "ETH",
    strike: 3600,
    daysToExpiry: 30,
    expiryLabel: "30 天后到期",
    apr: 12.8,
    markPrice: 3320,
    payoffDescription: "长期仓位，锁定更高收益",
    type: "call"
  }
];
