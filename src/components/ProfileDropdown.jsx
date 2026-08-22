import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  Ticket,
  BookmarkCheck,
  Settings,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  ScanLine,
  BarChart3,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { initials } from "../utils/format";

const STUDENT_ITEMS = [
  { icon: User, label: "Profile", to: "/profile" },
  { icon: Ticket, label: "My Tickets", to: "/tickets" },
  { icon: BookmarkCheck, label: "My Registrations", to: "/profile#registrations" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const ORGANIZER_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/organizer" },
  { icon: CalendarDays, label: "My Events", to: "/organizer/events" },
  { icon: ScanLine, label: "Verify Attendees", to: "/organizer/verify" },
  { icon: BarChart3, label: "Analytics", to: "/organizer/analytics" },
];

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { profile, auth, logout } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!auth) return null;

  const isOrganizer = auth.role === "organizer";
  const items = isOrganizer ? ORGANIZER_ITEMS : STUDENT_ITEMS;
  const name = auth.name || profile.name;
  const email = auth.email || profile.email;

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast("Logged out — see you soon!", "info");
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-2.5 transition-all duration-200 hover:bg-white/10 sm:pr-3"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-md">
          {initials(name)}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block max-w-[120px] truncate text-[13px] font-semibold text-white">
            {name}
          </span>
          <span className="block text-[11px] capitalize text-slate-400">
            {auth.role}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/15 animate-scale-in dark:border-white/10 dark:bg-navy-850 dark:shadow-black/50"
        >
          <div className="border-b border-slate-100 px-4 py-3.5 dark:border-white/[0.07]">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {email}
            </p>
          </div>
          <div className="p-1.5">
            {items.map((item) => (
              <Link
                key={item.label}
                role="menuitem"
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <item.icon className="h-[17px] w-[17px]" />
                {item.label}
              </Link>
            ))}
            <button
              role="menuitem"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-[17px] w-[17px]" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
