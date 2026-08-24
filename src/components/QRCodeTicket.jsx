import { useRef } from "react";
import Modal from "./Modal";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  User,
  Hash,
  Download,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { formatDate, eventStatus } from "../utils/format";
import { StatusBadge } from "./TicketCard";
import { downloadTicketImage } from "../utils/ticketImage";

export default function QRCodeTicket({ registration, open, onClose }) {
  const { getEvent, profile } = useApp();
  const toast = useToast();
  const qrCanvasRef = useRef(null);
  if (!registration || !open) return null;
  const event = getEvent(registration.eventId);
  if (!event) return null;

  const payload = `CAMPUSHUB|${registration.regId}|${event.title}|${profile?.id || ""}`;

  const handleDownload = () => {
    try {
      downloadTicketImage({
        event,
        registration,
        qrCanvas: qrCanvasRef.current,
      });
      toast("Ticket downloaded as image.", "success");
    } catch {
      toast("Download failed — please try again.", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Digital Ticket" maxWidth="max-w-md">
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-500/30">
        <div className="relative h-24">
          <img src={event.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/85 to-indigo-800/70" />
          <div className="absolute inset-0 flex flex-col justify-center px-4">
            <p className="text-[15px] font-bold text-white">{event.title}</p>
            <p className="mt-0.5 text-xs font-medium text-violet-200">{event.department}</p>
          </div>
        </div>

        <div className="bg-white p-5 dark:bg-transparent">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
            <Detail icon={CalendarDays} label="Date" value={formatDate(event.date)} />
            <Detail icon={Clock} label="Time" value={event.time} />
            <Detail icon={MapPin} label="Venue" value={event.venue} />
            <Detail icon={User} label="Student" value={registration.studentName} />
          </div>

          <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-600" />

          <div className="flex flex-col items-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-inner dark:border-slate-600">
              <QRCodeSVG value={payload} size={148} level="M" bgColor="#ffffff" fgColor="#05091b" />
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-[13px] font-bold tracking-wider text-slate-700 dark:bg-white/[0.07] dark:text-slate-200">
              <Hash className="h-3.5 w-3.5" />
              {registration.regId}
            </p>
            <div className="mt-2.5">
              <StatusBadge status={registration.status} />
            </div>
            <button onClick={handleDownload} className="btn-gradient mt-4 h-11 w-full">
              <Download className="h-4 w-4" />
              Download Ticket
            </button>
            <p className="mt-4 rounded-xl bg-violet-50 px-4 py-2.5 text-center text-[12px] font-medium leading-relaxed text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <ShieldCheck className="mr-1 inline h-4 w-4 -translate-y-px" />
              Present your QR code at the venue entry for smooth verification.
            </p>
          </div>
        </div>
      </div>

      <div aria-hidden="true" style={{ position: "absolute", left: -9999, top: 0 }}>
        <QRCodeCanvas
          ref={qrCanvasRef}
          value={payload}
          size={220}
          level="M"
          bgColor="#ffffff"
          fgColor="#05091b"
        />
      </div>
    </Modal>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="mt-0.5 truncate font-semibold text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}
