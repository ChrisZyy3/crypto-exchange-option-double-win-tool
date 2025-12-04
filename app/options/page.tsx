"use client";

import { useMemo, useState } from "react";

import Hero from "@/components/sections/hero";
import { assetSpotPrice, optionMarkets, type AssetSymbol, type OptionDirection } from "@/components/options-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const directionTabs: { value: OptionDirection; label: string; description: string }[] = [
  { value: "lowBuy", label: "低买", description: "低于当前价格买入，赚取权利金" },
  { value: "highSell", label: "高卖", description: "高于当前价格卖出，赚取权利金" }
];

const tenorFilters = [
  { label: "全部", value: "all" },
  { label: "1 天", value: "1" },
  { label: "3 天", value: "3" },
  { label: "7 天", value: "7" }
];

export default function OptionsPage() {
  const [asset, setAsset] = useState<AssetSymbol>("BTC");
  const [direction, setDirection] = useState<OptionDirection>("lowBuy");
  const [tenor, setTenor] = useState<string>("all");

  const products = useMemo(() => {
    return optionMarkets.filter((item) => {
      const matchesAsset = item.asset === asset;
      const matchesDirection = item.direction === direction;
      const matchesTenor = tenor === "all" ? true : item.daysToSettlement === Number(tenor);
      return matchesAsset && matchesDirection && matchesTenor;
    });
  }, [asset, direction, tenor]);

  const currentSpot = assetSpotPrice[asset];

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
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
              指数价 {currentSpot.toLocaleString()} USDT
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
            {directionTabs.map((tab) => (
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
            <span className="mr-2 text-xs font-semibold text-slate-500">期限</span>
            {tenorFilters.map((filter) => (
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
            <span>目标价格</span>
            <span>距离目标价</span>
            <span>结算日期</span>
            <span>APR</span>
            <span>距离天数</span>
            <span className="text-right">操作</span>
          </div>
          <div className="divide-y">
            {products.map((item) => (
              <OptionListRow key={item.id} item={item} currentSpot={currentSpot} />
            ))}
            {products.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-600">暂未找到符合筛选条件的产品。</div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

interface OptionListRowProps {
  item: (typeof optionMarkets)[number];
  currentSpot: number;
}

function OptionListRow({ item, currentSpot }: OptionListRowProps) {
  const distancePercent = ((item.targetPrice - currentSpot) / currentSpot) * 100;
  const distanceLabel = `${distancePercent >= 0 ? "+" : ""}${distancePercent.toFixed(2)}%`;

  return (
    <>
      <div className="hidden items-center bg-white px-5 py-4 transition hover:bg-slate-50 md:grid md:grid-cols-[1.5fr,1.1fr,1.1fr,1fr,1fr,auto] md:gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
            {item.targetPrice.toLocaleString()} USDT
            {item.tag ? (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">{item.tag}</span>
            ) : null}
          </div>
          <p className="text-xs text-slate-500">标的价 {currentSpot.toLocaleString()} USDT</p>
        </div>
        <div className="text-sm font-semibold text-slate-900">{distanceLabel}</div>
        <div className="text-sm text-slate-800">{item.settlementDate}</div>
        <div className="text-sm font-semibold text-emerald-600">{item.apr.toFixed(2)}%</div>
        <div className="text-sm text-slate-800">{item.daysToSettlement} 天</div>
        <div className="flex justify-end">
          <Button className="bg-amber-500 text-white hover:bg-amber-600">立即购买</Button>
        </div>
      </div>

      <div className="grid gap-3 border-b bg-white px-4 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">{item.targetPrice.toLocaleString()} USDT</div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            距离 {distanceLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">结算</p>
            <p className="font-semibold text-slate-900">{item.settlementDate}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs text-slate-500">APR</p>
            <p className="font-semibold text-emerald-600">{item.apr.toFixed(2)}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">距离天数</p>
            <p className="font-semibold text-slate-900">{item.daysToSettlement} 天</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs text-slate-500">标的价</p>
            <p className="font-semibold text-slate-900">{currentSpot.toLocaleString()} USDT</p>
          </div>
        </div>
        <Button className="w-full bg-amber-500 text-white hover:bg-amber-600">立即购买</Button>
      </div>
    </>
  );
}
