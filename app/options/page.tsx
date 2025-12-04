"use client";

import { useMemo, useState } from "react";
import { Filter, SortAsc } from "lucide-react";

import Hero from "@/components/sections/hero";
import OptionCard from "@/components/option-card";
import { optionProducts, type AssetSymbol } from "@/components/options-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const durationFilters = [
  { label: "全部期限", value: "all" },
  { label: "≤ 7 天", value: "7" },
  { label: "≤ 14 天", value: "14" },
  { label: "≤ 30 天", value: "30" }
];

export default function OptionsPage() {
  const [asset, setAsset] = useState<AssetSymbol>("BTC");
  const [duration, setDuration] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("apr");

  const filteredProducts = useMemo(() => {
    const filteredByAsset = optionProducts.filter((item) => item.asset === asset);
    const filteredByDuration = duration === "all"
      ? filteredByAsset
      : filteredByAsset.filter((item) => item.daysToExpiry <= Number(duration));

    const sorted = [...filteredByDuration].sort((a, b) => {
      if (sortKey === "apr") return b.apr - a.apr;
      return a.daysToExpiry - b.daysToExpiry;
    });

    return sorted;
  }, [asset, duration, sortKey]);

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <section className="container mt-8 flex flex-col gap-4 pb-12">
        <FilterPanel
          duration={duration}
          onDurationChange={setDuration}
          onSortChange={setSortKey}
          sortKey={sortKey}
          onReset={() => {
            setDuration("all");
            setSortKey("apr");
          }}
        />
        <Card className="border-0 bg-transparent shadow-none">
          <Tabs value={asset} onValueChange={(value) => setAsset(value as AssetSymbol)}>
            <TabsList className="w-full overflow-auto">
              <TabsTrigger value="BTC">BTC 产品</TabsTrigger>
              <TabsTrigger value="ETH">ETH 产品</TabsTrigger>
            </TabsList>
            <TabsContent value={asset} className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <OptionCard key={product.id} product={product} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="mt-6 rounded-xl border bg-white p-6 text-center text-slate-500">
                  暂无符合条件的产品，请调整筛选。
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </section>
    </div>
  );
}

interface FilterPanelProps {
  duration: string;
  sortKey: string;
  onDurationChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

function FilterPanel({ duration, sortKey, onDurationChange, onSortChange, onReset }: FilterPanelProps) {
  return (
    <Card className="flex flex-col gap-3 border border-slate-200/80 bg-white/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Filter className="h-4 w-4" />
        快速筛选 BTC / ETH 期权
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-1">
          <Label>期限</Label>
          <Select value={duration} onValueChange={onDurationChange}>
            <SelectTrigger className="w-full min-w-[160px]">
              <SelectValue placeholder="选择期限" />
            </SelectTrigger>
            <SelectContent>
              {durationFilters.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>排序</Label>
          <Select value={sortKey} onValueChange={onSortChange}>
            <SelectTrigger className="w-full min-w-[160px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apr">APR 由高到低</SelectItem>
              <SelectItem value="tenor">期限由近到远</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="notional">示例名义本金 (USDT)</Label>
          <Input id="notional" placeholder="10,000" inputMode="numeric" />
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full gap-2" onClick={onReset}>
            <SortAsc className="h-4 w-4" />
            重置筛选
          </Button>
        </div>
      </div>
    </Card>
  );
}
