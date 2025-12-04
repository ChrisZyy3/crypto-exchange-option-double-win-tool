import { useState } from "react";

import { ArrowUpRight, Clock, ShieldCheck, TrendingUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { OptionProduct } from "./options-data";

interface OptionCardProps {
  product: OptionProduct;
}

export default function OptionCard({ product }: OptionCardProps) {
  return (
    <Card className="card-gradient h-full backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
            {product.asset} {product.type === "call" ? "认购" : "认沽"}
          </p>
          <CardTitle>
            执行价 {product.strike.toLocaleString()} USDT
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-slate-500" />
            {product.expiryLabel}
          </CardDescription>
        </div>
        <div className="rounded-lg bg-slate-900 px-3 py-2 text-right text-white shadow">
          <p className="text-xs opacity-80">预估 APR</p>
          <p className="text-2xl font-semibold">{product.apr}%</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 md:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-lg border bg-white/70 p-3">
            <span className="text-xs text-slate-500">标记价</span>
            <span className="text-base font-semibold text-slate-900">
              {product.markPrice.toLocaleString()} USDT
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border bg-white/70 p-3">
            <span className="text-xs text-slate-500">期限</span>
            <span className="text-base font-semibold text-slate-900">{product.daysToExpiry} 天</span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border bg-white/70 p-3">
            <span className="text-xs text-slate-500">行权说明</span>
            <span className="text-sm font-semibold text-slate-900">{product.payoffDescription}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            统一保证金账户（示例）
          </div>
          <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
            <TrendingUp className="h-3.5 w-3.5" />
            深度筛选优选合约
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-600">
          预计行权路径：到期 ITM 自动对冲现货；OTM 保留权利金。
        </div>
        <PurchaseDialog product={product} />
      </CardFooter>
    </Card>
  );
}

function PurchaseDialog({ product }: OptionCardProps) {
  const [open, setOpen] = useState(false);
  const [priceType, setPriceType] = useState("limit");

  return (
    <>
      <Button className="w-full md:w-auto" onClick={() => setOpen(true)}>
        立即购买
        <ArrowUpRight className="ml-2 h-4 w-4" />
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  {product.asset} {product.type === "call" ? "认购" : "认沽"}
                </p>
                <h2 className="text-xl font-semibold text-slate-900">确认下单</h2>
                <p className="text-sm text-slate-600">
                  执行价 {product.strike.toLocaleString()} USDT · {product.expiryLabel} · 预估 APR {product.apr}%
                </p>
              </div>
              <button
                aria-label="关闭"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="order-size">购买数量</Label>
                  <Input id="order-size" placeholder="例如 0.1" type="number" min="0" step="0.001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-type">价格类型</Label>
                  <select
                    id="price-type"
                    value={priceType}
                    onChange={(event) => setPriceType(event.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <option value="limit">限价（推荐）</option>
                    <option value="market">市价</option>
                    <option value="post">Post Only</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="limit-price">委托价格 (USDT)</Label>
                  <Input id="limit-price" placeholder={product.markPrice.toString()} type="number" min="0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-id">自定义 ID（可选）</Label>
                  <Input id="client-id" placeholder="用于追踪幂等" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setOpen(false)}>
                模拟下单
              </Button>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                确认下单
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
