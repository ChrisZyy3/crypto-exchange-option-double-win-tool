"use client";

import { useMemo, useState } from "react";

import Hero from "@/components/sections/hero";
import type { HeroCopy } from "@/components/sections/hero";
import { optionMarkets, type AssetSymbol, type OptionDirection } from "@/components/options-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBybitIndexPrice } from "@/lib/use-bybit-index-price";

type Language = "en" | "zh";

const formatPrice = (value: number | null | undefined) =>
  typeof value === "number" ? `$${value.toLocaleString()}` : "--";

const translations: Record<
  Language,
  {
    hero: Omit<HeroCopy, "stats"> & {
      liveStatus: string;
      loadingStatus: string;
      unavailableStatus: string;
      labels: { btc: string; eth: string; bnb: string };
    };
    controls: {
      assetPrice: string;
      assetPriceLoading: string;
      directionTabs: { value: OptionDirection; label: string; description: string }[];
      tenorLabel: string;
      tenorFilters: { label: string; value: string }[];
      languageToggle: string;
    };
    table: {
      headers: string[];
      distancePrefix: string;
      empty: string;
      tenorUnit: string;
      buyNow: string;
    };
  }> = {
  en: {
    hero: {
      badge: "BTC & ETH dual-currency style options",
      title: "Choose BTC / ETH options with dual-earn style experience",
      subtitle:
        "Mobile-friendly ordering. All signing and risk checks run through a Next.js API Route proxy so secrets stay off the browser.",
      performanceLabel: "Asset performance",
      realtimeLabel: "Live index snapshot (proxied from Bybit)",
      liveStatus: "Live price",
      loadingStatus: "Loading live price...",
      unavailableStatus: "Price unavailable",
      labels: { btc: "BTC", eth: "ETH", bnb: "BNB" }
    },
    controls: {
      assetPrice: "Index price",
      assetPriceLoading: "Loading price...",
      directionTabs: [
        { value: "lowBuy", label: "Buy Low", description: "Bid below spot to earn premium" },
        { value: "highSell", label: "Sell High", description: "Offer above spot to earn premium" }
      ],
      tenorLabel: "Tenor",
      tenorFilters: [
        { label: "All", value: "all" },
        { label: "1 day", value: "1" },
        { label: "3 days", value: "3" },
        { label: "7 days", value: "7" }
      ],
      languageToggle: "中文"
    },
    table: {
      headers: ["Target price", "Distance", "Settlement", "APR", "Days", "Action"],
      distancePrefix: "Distance",
      empty: "No products match the filters.",
      tenorUnit: "days",
      buyNow: "Buy now"
    }
  },
  zh: {
    hero: {
      badge: "BTC & ETH 双币宝风格期权下单",
      title: "即刻选择 BTC / ETH 期权，享受双币宝式收益体验",
      subtitle: "前端优先、移动端友好的下单体验。所有签名与风控通过 Next.js API Route 代为处理，确保密钥不落地浏览器。",
      performanceLabel: "资产表现",
      realtimeLabel: "通过代理获取的实时指数价",
      liveStatus: "实时价格",
      loadingStatus: "正在获取价格...",
      unavailableStatus: "暂无价格",
      labels: { btc: "BTC", eth: "ETH", bnb: "BNB" }
    },
    controls: {
      assetPrice: "指数价",
      assetPriceLoading: "获取中...",
      directionTabs: [
        { value: "lowBuy", label: "低买", description: "低于当前价格买入，赚取权利金" },
        { value: "highSell", label: "高卖", description: "高于当前价格卖出，赚取权利金" }
      ],
      tenorLabel: "期限",
      tenorFilters: [
        { label: "全部", value: "all" },
        { label: "1 天", value: "1" },
        { label: "3 天", value: "3" },
        { label: "7 天", value: "7" }
      ],
      languageToggle: "EN"
    },
    table: {
      headers: ["目标价格", "距离目标价", "结算日期", "APR", "距离天数", "操作"],
      distancePrefix: "距离",
      empty: "暂未找到符合筛选条件的产品。",
      tenorUnit: "天",
      buyNow: "立即购买"
    }
  }
};

export default function OptionsPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [asset, setAsset] = useState<AssetSymbol>("BTC");
  const [direction, setDirection] = useState<OptionDirection>("lowBuy");
  const [tenor, setTenor] = useState<string>("all");

  const t = translations[language];

  const {
    data: btcIndex,
    isLoading: isBtcLoading,
    error: btcError
  } = useBybitIndexPrice("BTC");
  const {
    data: ethIndex,
    isLoading: isEthLoading,
    error: ethError
  } = useBybitIndexPrice("ETH");
  const {
    data: bnbIndex,
    isLoading: isBnbLoading,
    error: bnbError
  } = useBybitIndexPrice("BNB");

  const priceLookup: Record<AssetSymbol, number | null> = {
    BTC: btcIndex?.price ?? null,
    ETH: ethIndex?.price ?? null,
    BNB: bnbIndex?.price ?? null
  };

  const assetStatuses: Record<AssetSymbol, string> = {
    BTC: isBtcLoading ? t.hero.loadingStatus : btcIndex && !btcError ? t.hero.liveStatus : t.hero.unavailableStatus,
    ETH: isEthLoading ? t.hero.loadingStatus : ethIndex && !ethError ? t.hero.liveStatus : t.hero.unavailableStatus,
    BNB: isBnbLoading ? t.hero.loadingStatus : bnbIndex && !bnbError ? t.hero.liveStatus : t.hero.unavailableStatus
  };

  const heroStats: HeroCopy["stats"] = [
    {
      label: t.hero.labels.btc,
      value: formatPrice(btcIndex?.price),
      status: assetStatuses.BTC
    },
    {
      label: t.hero.labels.eth,
      value: formatPrice(ethIndex?.price),
      status: assetStatuses.ETH
    },
    {
      label: t.hero.labels.bnb,
      value: formatPrice(bnbIndex?.price),
      status: assetStatuses.BNB
    }
  ];

  const heroCopy: HeroCopy = {
    badge: t.hero.badge,
    title: t.hero.title,
    subtitle: t.hero.subtitle,
    performanceLabel: t.hero.performanceLabel,
    realtimeLabel: t.hero.realtimeLabel,
    stats: heroStats
  };

  const currentSpot = priceLookup[asset];
  const currentSpotLabel = typeof currentSpot === "number" ? currentSpot.toLocaleString() : "--";
  const isAssetLoading =
    asset === "BTC" ? isBtcLoading : asset === "ETH" ? isEthLoading : isBnbLoading;

  const products = useMemo(() => {
    if (typeof currentSpot !== "number") {
      return [];
    }

    return optionMarkets.filter((item) => {
      const matchesAsset = item.asset === asset;
      const matchesDirection = item.direction === direction;
      const matchesTenor = tenor === "all" ? true : item.daysToSettlement === Number(tenor);
      return matchesAsset && matchesDirection && matchesTenor;
    });
  }, [asset, direction, tenor, currentSpot]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-end px-6 pt-4 text-sm text-slate-600">
        <button
          type="button"
          onClick={() => setLanguage((prev) => (prev === "en" ? "zh" : "en"))}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {t.controls.languageToggle}
        </button>
      </div>
      <Hero copy={heroCopy} />
      <section className="container mt-8 flex flex-col gap-5 pb-14">
        <Card className="border border-slate-200/80 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(["BTC", "ETH"] as AssetSymbol[]).map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => setAsset(symbol)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    asset === symbol
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  type="button"
                >
                  {symbol}
                </button>
              ))}
            </div>
            <div className="text-sm text-slate-600">
              {t.controls.assetPrice}{" "}
              <span className="font-semibold text-slate-900">{currentSpotLabel} USDT</span>
              <span className="ml-2 text-xs text-slate-500">
                {isAssetLoading ? t.controls.assetPriceLoading : assetStatuses[asset]}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
            {t.controls.directionTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setDirection(tab.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  direction === tab.value
                    ? "bg-amber-50 text-amber-800 ring-2 ring-amber-200"
                    : "bg-slate-100 text-slate-700 hover:bg-white"
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  <span className="text-xs font-normal text-slate-500">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4 text-sm text-slate-600">
            <span className="mr-2 text-xs font-semibold text-slate-500">{t.controls.tenorLabel}</span>
            {t.controls.tenorFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTenor(filter.value)}
                className={`rounded-full px-3 py-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  tenor === filter.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-white"
                }`}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="border border-slate-200/80 bg-white/90 p-0 shadow-sm">
          <div className="hidden border-b px-5 py-3 text-xs font-semibold uppercase text-slate-500 md:grid md:grid-cols-[1.5fr,1.1fr,1.1fr,1fr,1fr,auto]">
            <span>{t.table.headers[0]}</span>
            <span>{t.table.headers[1]}</span>
            <span>{t.table.headers[2]}</span>
            <span>{t.table.headers[3]}</span>
            <span>{t.table.headers[4]}</span>
            <span className="text-right">{t.table.headers[5]}</span>
          </div>
          <div className="divide-y">
            {products.map((item) => (
              <OptionListRow key={item.id} item={item} currentSpot={currentSpot} language={language} />
            ))}
            {products.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-600">{t.table.empty}</div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

interface OptionListRowProps {
  item: (typeof optionMarkets)[number];
  currentSpot: number | null;
  language: Language;
}

function OptionListRow({ item, currentSpot, language }: OptionListRowProps) {
  const hasSpot = typeof currentSpot === "number";
  const distancePercent = hasSpot ? ((item.targetPrice - currentSpot) / currentSpot) * 100 : null;
  const distanceLabel =
    hasSpot && distancePercent !== null
      ? `${distancePercent >= 0 ? "+" : ""}${distancePercent.toFixed(2)}%`
      : "--";
  const currentSpotLabel = hasSpot ? currentSpot.toLocaleString() : "--";
  const t = translations[language];

  return (
    <>
      <div className="hidden items-center bg-white px-5 py-4 transition hover:bg-slate-50 md:grid md:grid-cols-[1.5fr,1.1fr,1.1fr,1fr,1fr,auto] md:gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
            {item.targetPrice.toLocaleString()} USDT
          </div>
          <p className="text-xs text-slate-500">{`${language === "en" ? "Spot" : "标的价"} ${currentSpotLabel} USDT`}</p>
        </div>
        <div className="text-sm font-semibold text-slate-900">{distanceLabel}</div>
        <div className="text-sm text-slate-800">{item.settlementDate}</div>
        <div className="text-sm font-semibold text-emerald-600">{item.apr.toFixed(2)}%</div>
        <div className="text-sm text-slate-800">
          {item.daysToSettlement} {language === "en" ? t.table.tenorUnit : `${t.table.tenorUnit}`}
        </div>
        <div className="flex justify-end">
          <Button className="bg-amber-500 text-white hover:bg-amber-600">{t.table.buyNow}</Button>
        </div>
      </div>

      <div className="grid gap-3 border-b bg-white px-4 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">{item.targetPrice.toLocaleString()} USDT</div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {t.table.distancePrefix} {distanceLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">{language === "en" ? "Settlement" : "结算"}</p>
            <p className="font-semibold text-slate-900">{item.settlementDate}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs text-slate-500">APR</p>
            <p className="font-semibold text-emerald-600">{item.apr.toFixed(2)}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">{language === "en" ? "Days" : "距离天数"}</p>
            <p className="font-semibold text-slate-900">
              {item.daysToSettlement} {language === "en" ? t.table.tenorUnit : `${t.table.tenorUnit}`}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs text-slate-500">{language === "en" ? "Spot" : "标的"}</p>
            <p className="font-semibold text-slate-900">{currentSpotLabel} USDT</p>
          </div>
        </div>
        <Button className="w-full bg-amber-500 text-white hover:bg-amber-600">{t.table.buyNow}</Button>
      </div>
    </>
  );
}
