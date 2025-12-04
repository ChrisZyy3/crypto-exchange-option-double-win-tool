import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="border-y bg-white/80 backdrop-blur">
      <div className="container grid gap-6 py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Sparkles className="h-4 w-4" />
            BTC & ETH 双币宝风格期权下单
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
            即刻选择 BTC / ETH 期权，享受双币宝式收益体验
          </h1>
          <p className="text-base text-slate-600 md:text-lg">
            前端优先、移动端友好的下单体验。所有签名与风控通过 Next.js API Route 代为处理，确保密钥不落地浏览器。
          </p>
        </div>
        <div className="rounded-2xl border bg-white/70 p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>资产表现</span>
            <span className="text-xs">实时指数价占位</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center md:grid-cols-3">
            {["BTC", "ETH", "稳定收益"].map((item, idx) => (
              <div key={item} className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{item}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {idx === 2 ? "10%+" : idx === 0 ? "$61,280" : "$3,320"}
                </p>
                <p className="text-xs text-emerald-600">趋势良好</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
