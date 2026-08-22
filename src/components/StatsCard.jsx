import { TrendingUp, TrendingDown } from "lucide-react";

const TINTS = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  blue: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
};

export default function StatsCard({ icon: Icon, label, value, sub, tint = "violet", trend }) {
  return (
    <div className="card group p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/[0.06] dark:hover:shadow-black/30">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${TINTS[tint]}`}
        >
          <Icon className="h-[22px] w-[22px]" />
        </span>
        {trend !== undefined && (
          <span
            className={`badge-soft ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-[28px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
