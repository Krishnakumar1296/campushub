import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  ScanLine,
  BarChart3,
} from "lucide-react";

const TABS = [
  { to: "/organizer", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/organizer/events", end: false, label: "My Events", icon: CalendarDays },
  { to: "/organizer/create-event", end: false, label: "Create Event", icon: PlusCircle },
  { to: "/organizer/verify", end: false, label: "Verify", icon: ScanLine },
  { to: "/organizer/analytics", end: false, label: "Analytics", icon: BarChart3 },
];

export default function OrganizerTabs() {
  return (
    <div className="sticky top-[72px] z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-white/[0.06] dark:bg-navy-900/80">
      <div className="no-scrollbar mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                  : "text-slate-500 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
              }`
            }
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
