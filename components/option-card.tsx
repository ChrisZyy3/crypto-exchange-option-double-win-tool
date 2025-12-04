import { ArrowUpRight, Clock, ShieldCheck, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          立即购买
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
            {product.asset} {product.type === "call" ? "认购" : "认沽"}
          </p>
          <DialogTitle>确认下单</DialogTitle>
          <DialogDescription>
            执行价 {product.strike.toLocaleString()} USDT · {product.expiryLabel} · 预估 APR {product.apr}%
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order-size">购买数量</Label>
              <Input id="order-size" placeholder="例如 0.1" type="number" min="0" step="0.001" />
            </div>
            <div className="space-y-2">
              <Label>价格类型</Label>
              <Select defaultValue="limit">
                <SelectTrigger aria-label="选择价格类型">
                  <SelectValue placeholder="选择价格类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limit">限价（推荐）</SelectItem>
                  <SelectItem value="market">市价</SelectItem>
                  <SelectItem value="post">Post Only</SelectItem>
                </SelectContent>
              </Select>
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
        <DialogFooter>
          <Button variant="secondary" className="w-full sm:w-auto">
            模拟下单
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            确认下单
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
