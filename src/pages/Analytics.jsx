import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  CalendarCheck2,
  ChartPie,
  Ticket,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import StatsCard from "../components/StatsCard";
import { REG_TREND } from "../data/events";
import { CATEGORY_STYLES, fmtNum, pct } from "../utils/format";

export default function Analytics() {
  const { events, theme } = useApp();

  const stats = useMemo(() => {
    const totalRegs = events.reduce((s, e) => s + e.registered, 0);
    const totalSeats = events.reduce((s, e) => s + e.capacity, 0);
    const attended = events.reduce((s, e) => s + (e.attended || 0), 0);
    return {
      totalRegs,
      totalSeats,
      attended,
      fill: pct(totalRegs, totalSeats),
      turnout: pct(attended, totalRegs),
      live: events.filter((e) => e.status !== "Draft" && e.status !== "Completed").length,
    };
  }, [events]);

  const categoryData = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.registered;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [events]);

  const topEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => b.registered - a.registered)
        .slice(0, 6)
        .map((e) => ({
          name: e.title.length > 22 ? `${e.title.slice(0, 21)}…` : e.title,
          fullTitle: e.title,
          registrations: e.registered,
          capacity: e.capacity,
        })),
    [events]
  );

  const axisTick = { fontSize: 11, fill: "#94a3b8" };
  const gridStroke =
    theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(100,116,139,0.15)";
  const tooltipStyle =
    theme === "dark"
      ? {
          backgroundColor: "#0d1530",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          color: "#e2e8f0",
          fontSize: 12,
        }
      : {
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          fontSize: 12,
        };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <span className="badge-soft bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <ChartPie className="h-3.5 w-3.5" />
          Analytics
        </span>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[34px]">
          Event performance insights
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Understand registration trends, category mix and which events pull
          the biggest crowds.
        </p>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={Ticket} label="Total registrations" value={fmtNum(stats.totalRegs)} tint="violet" trend={9} />
        <StatsCard
          icon={Users}
          label="Seat utilization"
          value={`${stats.fill}%`}
          sub={`${fmtNum(stats.totalSeats)} seats offered`}
          tint="blue"
        />
        <StatsCard
          icon={BadgeCheck}
          label="Attendance rate"
          value={`${stats.turnout}%`}
          sub={`${fmtNum(stats.attended)} checked in`}
          tint="green"
        />
        <StatsCard
          icon={CalendarCheck2}
          label="Active events"
          value={stats.live}
          sub="Open for registration"
          tint="orange"
        />
      </div>

      <section className="card mt-6 p-5 animate-slide-up">
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
          Registrations vs attendance
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">Campus-wide monthly totals</p>
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={REG_TREND} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#94a3b8", strokeDasharray: 4 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="registrations"
                name="Registrations"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-5">
        <section className="card p-5 xl:col-span-3 animate-slide-up">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
            Most registered events
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">Top 6 by sign-ups</p>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topEvents}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ ...axisTick, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(124,58,237,0.06)" }}
                  formatter={(value) => [value, "Registrations"]}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload.fullTitle || label
                  }
                />
                <Bar dataKey="registrations" radius={[0, 8, 8, 0]} barSize={18}>
                  {topEvents.map((_, i) => (
                    <Cell key={i} fill="#7c3aed" fillOpacity={1 - i * 0.12} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5 xl:col-span-2 animate-slide-up">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
            Category distribution
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">Registrations by event type</p>
          <div className="mt-2 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="82%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryData.map((c) => (
                    <Cell
                      key={c.name}
                      fill={
                        (CATEGORY_STYLES[c.name] || CATEGORY_STYLES.Other).accent
                      }
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [`${value} regs`, name]} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconSize={9} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="card mt-6 overflow-hidden animate-slide-up">
        <h2 className="px-5 pt-5 text-[15px] font-bold text-slate-900 dark:text-white">
          Category breakdown table
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse">
            <thead className="border-y border-slate-200/70 bg-slate-50/60 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <tr>
                <th className="th">Category</th>
                <th className="th">Events</th>
                <th className="th">Registered</th>
                <th className="th">Capacity</th>
                <th className="th">Fill Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {categoryData.map((c) => {
                const catEvents = events.filter((e) => e.category === c.name);
                const cap = catEvents.reduce((s, e) => s + e.capacity, 0);
                const style =
                  CATEGORY_STYLES[c.name] || CATEGORY_STYLES.Other;
                return (
                  <tr key={c.name} className="transition-colors hover:bg-violet-50/50 dark:hover:bg-white/[0.03]">
                    <td className="td">
                      <span className={`badge-soft ${style.chip}`}>{c.name}</span>
                    </td>
                    <td className="td">{catEvents.length}</td>
                    <td className="td font-semibold">{fmtNum(c.value)}</td>
                    <td className="td">{fmtNum(cap)}</td>
                    <td className="td">
                      <span className="font-bold text-violet-600 dark:text-violet-400">
                        {pct(c.value, cap)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
