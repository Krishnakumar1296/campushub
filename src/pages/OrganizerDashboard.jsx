import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarRange,
  Percent,
  PlusCircle,
  ScanLine,
  Ticket,
  UserCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import StatsCard from "../components/StatsCard";
import { AvatarInitials, StatusBadge } from "../components/TicketCard";
import { REG_TREND } from "../data/events";
import { fmtNum, pct, timeAgo } from "../utils/format";

export default function OrganizerDashboard() {
  const { events, registrations, getEvent, theme } = useApp();

  const stats = useMemo(() => {
    const totalRegs = events.reduce((s, e) => s + e.registered, 0);
    const totalSeats = events.reduce((s, e) => s + e.capacity, 0);
    const attended = events.reduce((s, e) => s + (e.attended || 0), 0);
    return {
      totalRegs,
      avgFill: pct(totalRegs, totalSeats),
      checkInRate: pct(attended, totalRegs),
    };
  }, [events]);

  const recent = useMemo(
    () =>
      [...registrations]
        .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
        .slice(0, 6),
    [registrations]
  );

  const topEvents = useMemo(
    () =>
      [...events]
        .sort(
          (a, b) =>
            pct(b.registered, b.capacity) - pct(a.registered, a.capacity)
        )
        .slice(0, 5),
    [events]
  );

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

  const gridStroke =
    theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(100,116,139,0.15)";

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <span className="badge-soft bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            <Activity className="h-3.5 w-3.5" />
            Organizer Dashboard
          </span>
          <h1 className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[34px]">
            Welcome back, organizer
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track registrations, attendance and event performance at a glance.
          </p>
        </div>
        <Link to="/organizer/create-event" className="btn-gradient px-5 py-2.5">
          <PlusCircle className="h-4 w-4" />
          New Event
        </Link>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon={CalendarRange}
          label="Total events"
          value={events.length}
          sub={`${events.filter((e) => e.status === "Upcoming").length} upcoming`}
          tint="violet"
        />
        <StatsCard
          icon={Ticket}
          label="Total registrations"
          value={fmtNum(stats.totalRegs)}
          sub="Across all events"
          tint="blue"
          trend={12}
        />
        <StatsCard
          icon={Percent}
          label="Avg seat fill rate"
          value={`${stats.avgFill}%`}
          sub="Capacity utilization"
          tint="orange"
        />
        <StatsCard
          icon={UserCheck}
          label="Check-in rate"
          value={`${stats.checkInRate}%`}
          sub={`${stats.checkInRate >= 70 ? "Healthy turnout" : "Needs attention"}`}
          tint="green"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2 animate-slide-up">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Registration trend
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Monthly registrations vs actual attendance
              </p>
            </div>
            <span className="badge-soft bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              +18% vs last month
            </span>
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REG_TREND} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="gReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#94a3b8", strokeDasharray: 4 }} />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#gReg)"
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fill="url(#gAtt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5 animate-slide-up">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
            Top filling events
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">Ranked by capacity used</p>
          <div className="mt-4 space-y-4">
            {topEvents.map((e, i) => {
              const f = pct(e.registered, e.capacity);
              return (
                <div key={e.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[13px]">
                    <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-100 text-[10px] font-extrabold text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                        {i + 1}
                      </span>
                      <span className="truncate">{e.title}</span>
                    </span>
                    <span className="shrink-0 font-bold text-slate-500 dark:text-slate-400">
                      {f}%
                    </span>
                  </div>
                  <div className="ml-7 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        f >= 90
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : f >= 60
                          ? "bg-gradient-to-r from-violet-500 to-indigo-600"
                          : "bg-gradient-to-r from-teal-500 to-emerald-600"
                      }`}
                      style={{ width: `${f}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            to="/organizer/events"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-600 transition hover:gap-2.5 hover:text-violet-700 dark:text-violet-400"
          >
            Manage all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <section className="card mt-6 overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
              Recent registrations
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Latest students who signed up across your events
            </p>
          </div>
          <Link
            to="/organizer/verify"
            className="btn-outline shrink-0 px-4 py-2 text-[13px]"
          >
            <ScanLine className="h-4 w-4 text-violet-500" />
            Verify
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="border-y border-slate-200/70 bg-slate-50/60 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <tr>
                <th className="th">Student</th>
                <th className="th">Event</th>
                <th className="th">Department</th>
                <th className="th">Registered</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {recent.map((r) => (
                <tr key={r.regId} className="transition-colors hover:bg-violet-50/50 dark:hover:bg-white/[0.03]">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <AvatarInitials name={r.studentName} size="h-9 w-9 text-[11px]" />
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                          {r.studentName}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td max-w-[220px] truncate font-medium">
                    {getEvent(r.eventId)?.title || "—"}
                  </td>
                  <td className="td">
                    <span className="text-[12px]">
                      {r.department}
                      <span className="block text-[11px] text-slate-400">{r.year}</span>
                    </span>
                  </td>
                  <td className="td text-[13px] text-slate-400">
                    {timeAgo(new Date(r.registeredAt).getTime())}
                  </td>
                  <td className="td">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            to: "/organizer/create-event",
            icon: PlusCircle,
            title: "Create an event",
            desc: "Publish a new event with tickets",
          },
          {
            to: "/organizer/verify",
            icon: ScanLine,
            title: "Verify attendees",
            desc: "Check-in via registration ID",
          },
          {
            to: "/organizer/analytics",
            icon: BarChart3,
            title: "View analytics",
            desc: "Deep-dive into trends and splits",
          },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="card group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/[0.07] dark:hover:border-violet-400/30"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25 transition-transform duration-300 group-hover:scale-110">
              <a.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-800 dark:text-white">
                {a.title}
              </span>
              <span className="block text-xs text-slate-400">{a.desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
