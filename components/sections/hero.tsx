import { Sparkles } from "lucide-react";

export interface HeroCopy {
  badge: string;
  title: string;
  subtitle: string;
  performanceLabel: string;
  realtimeLabel: string;
  stats: { label: string; value: string; status: string }[];
}

interface HeroProps {
  copy: HeroCopy;
}

export default function Hero({ copy }: HeroProps) {
  return (
    <section className="border-y bg-white/80 backdrop-blur">
      <div className="container grid gap-6 py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Sparkles className="h-4 w-4" />
            {copy.badge}
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
            {copy.title}
          </h1>
          <p className="text-base text-slate-600 md:text-lg">{copy.subtitle}</p>
        </div>
        <div className="rounded-2xl border bg-white/70 p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{copy.performanceLabel}</span>
            <span className="text-xs">{copy.realtimeLabel}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center md:grid-cols-3">
            {copy.stats.map((item) => (
              <div key={item.label} className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="text-xs text-emerald-600">{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
