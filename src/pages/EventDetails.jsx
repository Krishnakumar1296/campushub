import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Clock,
  ImageOff,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import ShareMenu from "../components/ShareMenu";
import {
  CATEGORY_STYLES,
  daysUntil,
  eventStatus,
  formatDate,
  formatDateLong,
  pct,
} from "../utils/format";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, events, myRegistrations, registerForEvent } = useApp();
  const toast = useToast();
  const [imgFailed, setImgFailed] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [busy, setBusy] = useState(false);

  const event = getEvent(id);

  const related = useMemo(() => {
    if (!event) return [];
    return events
      .filter(
        (e) =>
          e.id !== event.id &&
          e.category === event.category &&
          e.status !== "Draft"
      )
      .slice(0, 3);
  }, [event, events]);

  if (!event) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Event not found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This event may have been removed or the link is incorrect.
        </p>
        <Link to="/events" className="btn-gradient mt-6 px-6 py-3">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const style = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other;
  const status = eventStatus(event);
  const fillPct = pct(event.registered, event.capacity);
  const registered = myRegistrations.some((r) => r.eventId === event.id);
  const isRegistered = registered || justRegistered;
  const deadlineDays = daysUntil(event.registrationDeadline);

  const handleRegister = async () => {
    if (isRegistered || busy) return;
    setBusy(true);
    try {
      const res = await registerForEvent(event.id);
      if (res?.ok) {
        setJustRegistered(true);
        toast(`You're in! Ticket ${res.regId} is ready in My Tickets.`, "success");
      } else if (res && !res.duplicate) {
        toast(res.error, "error");
      }
    } catch {
      toast("Could not reach the server. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="card overflow-hidden animate-slide-up">
        <div className="relative aspect-[21/9] bg-gradient-to-br from-violet-500 to-indigo-600 sm:aspect-[24/9]">
          {!imgFailed ? (
            <img
              src={event.image}
              alt={event.title}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${style.gradient}`}
            >
              <ImageOff className="h-12 w-12 text-white/60" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-7">
            <div>
              <span
                className={`rounded-md border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${style.badge}`}
              >
                {event.category}
              </span>
              <h1 className="mt-2.5 max-w-2xl text-2xl font-extrabold tracking-tight text-white drop-shadow sm:text-3xl">
                {event.title}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white/85">
                <Building2 className="h-4 w-4 shrink-0" />
                {event.department}
              </p>
            </div>
            <ShareMenu title={event.title} className="shrink-0 [&>button]:h-10 [&>button]:w-10" />
          </div>
        </div>

        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Detail icon={CalendarDays} label="Date" value={formatDateLong(event.date)} />
              <Detail
                icon={Clock}
                label="Time"
                value={event.endTime ? `${event.time} – ${event.endTime}` : event.time}
              />
              <Detail icon={MapPin} label="Venue" value={event.venue} />
              <Detail
                icon={Users}
                label="Seats"
                value={`${event.registered} / ${event.capacity}`}
              />
            </div>

            <h2 className="mt-8 text-base font-bold text-slate-900 dark:text-white">
              About this event
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {event.longDescription || event.description}
            </p>

            {event.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                {event.tags.map((t) => (
                  <span
                    key={t}
                    className={`badge-soft ${style.chip}`}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {related.length > 0 && (
              <>
                <h2 className="mt-9 text-base font-bold text-slate-900 dark:text-white">
                  More {event.category} events
                </h2>
                <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/event/${r.id}`}
                      className="group overflow-hidden rounded-xl border border-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-white/[0.07] dark:hover:border-violet-400/30"
                    >
                      <img
                        src={r.image}
                        alt=""
                        loading="lazy"
                        className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="p-3">
                        <p className="line-clamp-1 text-[13px] font-bold text-slate-800 group-hover:text-violet-600 dark:text-slate-100 dark:group-hover:text-violet-400">
                          {r.title}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {formatDate(r.date)} • {r.venue}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-[140px] lg:self-start">
            <div className="card space-y-5 p-5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${
                  status.key === "open"
                    ? "bg-emerald-500/95"
                    : status.key === "closing"
                    ? "bg-amber-500/95"
                    : status.key === "full" || status.key === "closed"
                    ? "bg-red-500/90"
                    : "bg-slate-600/90"
                }`}
              >
                {status.label}
              </span>

              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>
                    <b className="text-slate-800 dark:text-slate-200">
                      {event.registered}
                    </b>{" "}
                    / {event.capacity} registered
                  </span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    {fillPct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${style.gradient}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 border-t border-dashed border-slate-200 pt-4 text-[13px] dark:border-white/[0.08]">
                <Row label="Registration deadline" value={event.registrationDeadline ? formatDate(event.registrationDeadline) : "No deadline"} />
                <Row
                  label="Status"
                  value={
                    event.registrationDeadline
                      ? deadlineDays > 0
                        ? `Closes in ${deadlineDays} day${deadlineDays === 1 ? "" : "s"}`
                        : "Closed"
                      : daysUntil(event.date) >= 0
                      ? "Open until event day"
                      : "Closed"
                  }
                />
                <Row label="Entry" value="Free for students" />
              </div>

              {isRegistered ? (
                <div className="space-y-3">
                  <button
                    disabled
                    className="inline-flex h-11 w-full cursor-default items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-600 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    You're registered
                  </button>
                  <Link to="/tickets" className="btn-outline w-full py-2.5 text-[13px]">
                    View my ticket
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
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
                  <Check className="h-4 w-4" strokeWidth={3} />
                  {busy ? "Registering…" : "Register Now — Free"}
                </button>
              )}

              <p className="text-center text-[11px] leading-relaxed text-slate-400">
                A QR ticket will be generated instantly after registering.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/[0.04]">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}
