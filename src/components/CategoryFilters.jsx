import {
  Sparkles,
  Cpu,
  Music,
  Trophy,
  Wrench,
  Mic,
  Flag,
  Users,
  Star,
} from "lucide-react";
import { CATEGORIES } from "../data/events";

const ICONS = {
  Sparkles,
  Cpu,
  Music,
  Trophy,
  Wrench,
  Mic,
  Flag,
  Users,
  Star,
};

export default function CategoryFilters({ active, onChange, counts }) {
  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {CATEGORIES.map((c) => {
        const Icon = ICONS[c.icon] || Sparkles;
        const isActive = active === c.value;
        const count = counts ? counts[c.value] : null;
        return (
          <button
            key={c.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(c.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 active:scale-95 ${
              isActive
                ? "border-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-violet-500/30"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-violet-400/40 dark:hover:text-white"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "" : "text-violet-500"}`} />
            {c.label}
            {count !== undefined && count !== null && (
              <span
                className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
