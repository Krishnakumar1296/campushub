import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheck, CalendarClock, Ticket as TicketIcon, TicketPlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatsCard from "../components/StatsCard";
import TicketCard from "../components/TicketCard";
import QRCodeTicket from "../components/QRCodeTicket";

export default function MyTickets() {
  const location = useLocation();
  const { myRegistrations } = useApp();
  const [qrReg, setQrReg] = useState(null);
  const [flashId, setFlashId] = useState(location.state?.highlight || null);

  useEffect(() => {
    if (!flashId) return;
    const el = document.getElementById(`ticket-${flashId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setFlashId(null), 2800);
    return () => clearTimeout(t);
  }, [flashId]);

  const total = myRegistrations.length;
  const checkedIn = myRegistrations.filter((r) => r.status === "Checked-in").length;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <span className="badge-soft bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <TicketIcon className="h-3.5 w-3.5" />
          My Tickets
        </span>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[34px]">
          Your event passes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          All your registrations in one place. Show the QR code at the venue
          for quick entry.
        </p>
      </header>

      {total > 0 && (
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard icon={TicketIcon} label="Total tickets" value={total} tint="violet" />
          <StatsCard
            icon={CalendarClock}
            label="Events attended / checked-in"
            value={checkedIn}
            tint="green"
            sub="Verified at venue entry"
          />
          <StatsCard
            icon={BadgeCheck}
            label="Latest registration"
            value={myRegistrations[0]?.regId || "—"}
            tint="blue"
          />
        </div>
      )}

      {total === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-20 text-center animate-scale-in">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.06]">
            <TicketPlus className="h-7 w-7 text-slate-400" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
            No tickets yet
          </h3>
          <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            You haven't registered for any events. Browse events and grab your
            first pass.
          </p>
          <Link to="/events" className="btn-gradient mt-6 px-6 py-3">
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {myRegistrations.map((reg, i) => (
            <div
              key={reg.regId}
              id={`ticket-${reg.regId}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`animate-slide-up rounded-2xl transition-all duration-500 ${
                flashId === reg.regId
                  ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-transparent"
                  : ""
              }`}
            >
              <TicketCard registration={reg} onViewQR={setQrReg} />
            </div>
          ))}
        </div>
      )}

      <QRCodeTicket
        registration={qrReg}
        open={!!qrReg}
        onClose={() => setQrReg(null)}
      />
    </div>
  );
}
