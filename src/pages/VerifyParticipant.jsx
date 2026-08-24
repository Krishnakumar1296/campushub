import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  History,
  Mail,
  MapPin,
  ScanLine,
  SearchX,
  Ticket as TicketIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { AvatarInitials, StatusBadge } from "../components/TicketCard";
import QrScanner from "../components/QrScanner";
import { formatDate, timeAgo } from "../utils/format";

function extractRegId(raw) {
  const value = String(raw || "").trim();
  if (/^CAMPUSHUB\|/i.test(value)) {
    const [, regId] = value.split("|");
    return (regId || "").trim();
  }
  return value;
}

export default function VerifyParticipant() {
  const { getRegistration, getEvent, markAttendance, addNotification, registrations } =
    useApp();
  const toast = useToast();
  const [regIdInput, setRegIdInput] = useState("");
  const [result, setResult] = useState(null);
  const [scanOpen, setScanOpen] = useState(false);

  const recentCheckIns = useMemo(
    () =>
      registrations
        .filter((r) => r.checkedInAt)
        .sort((a, b) => b.checkedInAt.localeCompare(a.checkedInAt))
        .slice(0, 5),
    [registrations]
  );

  const verify = (raw) => {
    const value = (raw ?? regIdInput).trim();
    if (!value) return;
    const reg = getRegistration(value);
    if (!reg) {
      setResult({ error: `No registration found for "${value}".` });
      return;
    }
    setResult({ reg });
    setRegIdInput(reg.regId);
  };

  const checkIn = async () => {
    if (!result?.reg) return;
    const updated = await markAttendance(result.reg.regId);
    if (!updated) {
      toast("Unable to check in — please try again.", "error");
      return;
    }
    setResult({ reg: updated });
    toast(`${updated.studentName} checked in successfully.`, "success");
    addNotification({
      type: "success",
      title: "Attendance recorded",
      message: `${updated.studentName} was checked in at the venue.`,
    });
  };

  const handleScan = (decoded) => {
    setScanOpen(false);
    const regId = extractRegId(decoded);
    if (!regId) return;
    setRegIdInput(regId);
    verify(regId);
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="text-center animate-fade-in">
        <span className="badge-soft bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <ScanLine className="h-3.5 w-3.5" />
          Verify Participants
        </span>
        <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[32px]">
          Gate check-in
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Scan the student's QR ticket with your camera, or enter the
          registration ID to verify and check them in.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          verify();
        }}
        className="card mx-auto mt-7 flex max-w-lg flex-col gap-3 p-4 animate-slide-up sm:flex-row"
      >
        <input
          value={regIdInput}
          onChange={(e) => setRegIdInput(e.target.value)}
          placeholder="REG-2026-0001"
          aria-label="Registration ID"
          className="input h-12 min-w-0 flex-1 font-mono font-semibold uppercase tracking-wider"
        />
        <button type="submit" className="btn-gradient h-12 shrink-0 px-5">
          <ScanLine className="h-4 w-4" />
          Verify
        </button>
        <button
          type="button"
          onClick={() => setScanOpen((v) => !v)}
          className={`h-12 shrink-0 rounded-xl px-5 text-sm font-bold transition ${
            scanOpen
              ? "border border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300"
              : "btn-gradient"
          }`}
        >
          <ScanLine className="h-4 w-4" />
          {scanOpen ? "Stop" : "Scan QR"}
        </button>
      </form>

      {scanOpen && (
        <QrScanner onScan={handleScan} onClose={() => setScanOpen(false)} />
      )}

      {result?.error && (
        <div className="card mx-auto mt-5 flex max-w-lg items-center gap-3.5 border-red-200 p-5 animate-scale-in dark:border-red-500/25">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
            <SearchX className="h-5 w-5 text-red-500" />
          </span>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {result.error} Double-check the ID on the QR ticket and try again.
          </p>
        </div>
      )}

      {result?.reg && (
        <ParticipantCard
          key={result.reg.regId + result.reg.status}
          reg={result.reg}
          event={getEvent(result.reg.eventId)}
          onCheckIn={checkIn}
        />
      )}

      {recentCheckIns.length > 0 && (
        <section className="card mx-auto mt-8 max-w-lg overflow-hidden animate-slide-up">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]">
            <History className="h-4 w-4 text-slate-400" />
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Recent check-ins
            </h2>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {recentCheckIns.map((r) => (
              <li key={r.regId}>
                <button
                  onClick={() => verify(r.regId)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-violet-50/60 dark:hover:bg-white/[0.04]"
                >
                  <AvatarInitials name={r.studentName} size="h-9 w-9 text-[11px]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                      {r.studentName}
                    </span>
                    <span className="block truncate text-[11px] text-slate-400">
                      {getEvent(r.eventId)?.title || r.regId}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {timeAgo(new Date(r.checkedInAt).getTime())}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ParticipantCard({ reg, event, onCheckIn }) {
  const checkedIn = reg.status === "Checked-in";
  return (
    <div className="card mx-auto mt-5 max-w-lg overflow-hidden animate-scale-in">
      <div className="flex items-center gap-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-extrabold text-white backdrop-blur">
          <AvatarInitials name={reg.studentName} size="h-14 w-14 text-base" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold text-white">{reg.studentName}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-violet-100">
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" /> {reg.year}
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" /> {reg.department}
            </span>
          </p>
        </div>
        <StatusBadge status={reg.status} />
      </div>

      <div className="space-y-3 p-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
          <Detail icon={TicketIcon} label="Reg. ID" value={reg.regId} mono />
          <Detail icon={Mail} label="Email" value={reg.email} />
          {event && (
            <>
              <Detail icon={CalendarDays} label="Event" value={event.title} />
              <Detail icon={Clock} label="Time" value={event.time} />
              <Detail icon={MapPin} label="Venue" value={event.venue} />
              <Detail
                icon={Clock}
                label="Registered"
                value={timeAgo(new Date(reg.registeredAt).getTime())}
              />
            </>
          )}
        </div>

        {!event && (
          <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            The linked event no longer exists.
          </p>
        )}

        {checkedIn ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <BadgeCheck className="h-5 w-5" />
            Already checked in
            {reg.checkedInAt &&
              ` — ${new Date(reg.checkedInAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
          </div>
        ) : (
          <button
            onClick={onCheckIn}
            disabled={!event}
            className="btn-gradient h-12 w-full"
          >
            <CheckCircle2 className="h-5 w-5" />
            Confirm Check-In
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value, mono }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-3 w-3 text-violet-500 dark:text-violet-400" />
        {label}
      </p>
      <p
        className={`truncate font-semibold text-slate-800 dark:text-slate-100 ${
          mono ? "font-mono text-[12px]" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
