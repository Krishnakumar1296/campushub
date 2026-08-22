import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  Check,
  ImageOff,
} from "lucide-react";
import { CATEGORY_STYLES, eventStatus, formatDate, pct } from "../utils/format";
import { useApp } from "../context/AppContext";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { myRegistrations, registerForEvent } = useApp();
  const [imgFailed, setImgFailed] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [busy, setBusy] = useState(false);

  const registered = myRegistrations.some((r) => r.eventId === event.id);
  const status = eventStatus(event);
  const style = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other;
  const fillPct = pct(event.registered, event.capacity);

  const handleRegister = async (e) => {
    e.stopPropagation();
    if (registered || justRegistered || busy) return;
    setBusy(true);
    try {
      const res = await registerForEvent(event.id);
      if (res?.ok) setJustRegistered(true);
    } catch {
      /* server unreachable */
    } finally {
      setBusy(false);
    }
  };

  const isRegistered = registered || justRegistered;

  return (
    <article
      onClick={() => navigate(`/event/${event.id}`)}
      className="card group flex cursor-pointer flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/[0.08] dark:hover:shadow-black/40"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600">
        {imgFailed ? (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${style.gradient}`}
          >
            <ImageOff className="h-10 w-10 text-white/60" />
          </div>
        ) : (
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        <span
          className={`absolute left-3 top-3 rounded-md border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm ${style.badge}`}
        >
          {event.category}
        </span>

        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg ${
            status.key === "open"
              ? "bg-emerald-500/95"
              : status.key === "closing"
              ? "bg-amber-500/95"
              : status.key === "full" || status.key === "closed"
              ? "bg-red-500/90"
              : "bg-slate-600/90"
          }`}
        >
          {status.key === "open" && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping-slow rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-[17px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
          {event.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
          {event.description}
        </p>

        <div className="mt-4 grid gap-2 border-t border-dashed border-slate-100 pt-4 dark:border-white/[0.06]">
          <Meta icon={CalendarDays}>{formatDate(event.date)}</Meta>
          <Meta icon={Clock}>
            {event.time}
            {event.endTime ? ` – ${event.endTime}` : ""}
          </Meta>
          <Meta icon={MapPin}>{event.venue}</Meta>
          <Meta icon={Building2}>{event.department}</Meta>
        </div>

        {!isRegistered && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                <b className="text-slate-800 dark:text-slate-200">
                  {event.registered}
                </b>{" "}
                / {event.capacity} Registered
              </span>
              <span
                className={`font-bold ${
                  fillPct >= 90
                    ? "text-red-500"
                    : fillPct >= 70
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {fillPct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-700`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 pt-1">
          {isRegistered ? (
            <button
              disabled
              aria-label="Already registered"
              className="inline-flex h-11 w-full cursor-default items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-600 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              <Check className="h-4 w-4" strokeWidth={3} />
              Registered ✓
            </button>
          ) : status.key === "full" ? (
            <button
              disabled
              className="h-11 w-full cursor-not-allowed rounded-xl bg-slate-100 text-sm font-bold text-slate-400 dark:bg-white/[0.05] dark:text-slate-500"
            >
              Event Full
            </button>
          ) : status.key === "closed" || status.key === "completed" ? (
            <button
              disabled
              className="h-11 w-full cursor-not-allowed rounded-xl bg-slate-100 text-sm font-bold text-slate-400 dark:bg-white/[0.05] dark:text-slate-500"
            >
              Registration Closed
            </button>
          ) : (
            <button onClick={handleRegister} disabled={busy} className="btn-gradient h-11 w-full">
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Meta({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-500 dark:text-slate-400">
      <Icon className="h-[15px] w-[15px] shrink-0 text-violet-500 dark:text-violet-400" />
      <span className="truncate">{children}</span>
    </div>
  );
}
