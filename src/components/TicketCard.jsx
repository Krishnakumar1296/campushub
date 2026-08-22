import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Ticket, BadgeCheck } from "lucide-react";
import { formatDate, initials } from "../utils/format";
import { useApp } from "../context/AppContext";

export function TicketRow({ registration }) {
  const event = useApp().getEvent(registration.eventId);
  if (!event) return null;
  return (
    <Link
      to={`/tickets`}
      state={{ highlight: registration.regId }}
      className="group flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/[0.07] dark:border-white/[0.07] dark:bg-white/[0.03] dark:hover:border-violet-400/30"
    >
      <Thumb event={event} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-slate-800 group-hover:text-violet-600 dark:text-slate-100 dark:group-hover:text-violet-400">
          {event.title}
        </p>
        <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-3 w-3 shrink-0 text-violet-500" />
          {formatDate(event.date)}
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <MapPin className="h-3 w-3 shrink-0 text-violet-500" />
          <span className="truncate">{event.venue}</span>
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-slate-500 dark:bg-white/[0.07] dark:text-slate-300">
            {registration.regId}
          </span>
          <StatusBadge status={registration.status} />
        </div>
      </div>
      <Ticket className="h-4 w-4 shrink-0 rotate-[-8deg] text-slate-300 transition group-hover:text-violet-500 dark:text-slate-600" />
    </Link>
  );
}

export function StatusBadge({ status }) {
  const checkedIn = status === "Checked-in" || status === "Checked-In";
  return (
    <span
      className={`badge-soft ${
        checkedIn
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
      }`}
    >
      {checkedIn && <BadgeCheck className="h-3 w-3" />}
      {status}
    </span>
  );
}

function Thumb({ event }) {
  return (
    <img
      src={event.image}
      alt=""
      loading="lazy"
      className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-sm"
    />
  );
}

export function AvatarInitials({ name, size = "h-9 w-9 text-xs" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white ${size}`}
    >
      {initials(name)}
    </span>
  );
}

export default function TicketCard({ registration, onViewQR }) {
  const event = useApp().getEvent(registration.eventId);
  if (!event) return null;
  return (
    <div className="card overflow-hidden">
      <div className="relative h-28 overflow-hidden">
        <img src={event.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-2.5 left-4 right-4 flex items-end justify-between gap-2">
          <p className="truncate text-sm font-bold text-white drop-shadow">{event.title}</p>
          <StatusBadge status={registration.status} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 p-4 text-[12px]">
        <Info label="Date" value={formatDate(event.date)} icon={CalendarDays} />
        <Info label="Time" value={event.time} icon={ClockIcon} />
        <Info label="Venue" value={event.venue} icon={MapPin} />
        <Info label="Reg. ID" value={registration.regId} mono />
      </div>
      <div className="border-t border-dashed border-slate-200 p-3 dark:border-white/10">
        <button onClick={() => onViewQR(registration)} className="btn-outline w-full py-2.5 text-[13px]">
          <Ticket className="h-4 w-4 text-violet-500" />
          View QR Ticket
        </button>
      </div>
    </div>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Info({ label, value, icon: Icon, mono }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-0.5 truncate font-semibold text-slate-700 dark:text-slate-200 ${mono ? "font-mono text-[11px]" : ""}`}>
        {value}
      </p>
    </div>
  );
}
