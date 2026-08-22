import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Ticket,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

function Logo() {
  return (
    <Link to="/events" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 shadow-lg shadow-indigo-900/40">
        <CalendarDays className="h-5 w-5 text-white" />
      </span>
      <span className="leading-tight">
        <span className="block text-[17px] font-bold tracking-tight text-white">
          Campus<span className="text-violet-400">Hub</span>
        </span>
        <span className="block text-[11px] font-medium text-slate-400">
          Campus Event Portal
        </span>
      </span>
    </Link>
  );
}

const STUDENT_LINKS = [
  { to: "/events", label: "Events", end: true },
  { to: "/tickets", label: "My Tickets", end: false },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme, auth } = useApp();
  const location = useLocation();

  const isStudent = auth?.role === "student";
  const isOrganizer = auth?.role === "organizer";
  const onLoginPage = location.pathname === "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-navy-950/95 backdrop-blur supports-[backdrop-filter]:bg-navy-950/80">
      <nav className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {isStudent && (
          <div className="ml-6 hidden items-center gap-1.5 lg:flex">
            {STUDENT_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}

        {isOrganizer && (
          <div className="ml-6 hidden items-center lg:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3.5 py-1.5 text-xs font-semibold text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Organizer mode
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="icon-btn"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>

          {auth ? (
            <>
              <NotificationDropdown />
              <ProfileDropdown />
              <button
                className="icon-btn lg:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            !onLoginPage && (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-md shadow-violet-900/40 transition hover:brightness-110 active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )
          )}
        </div>
      </nav>

      {auth && mobileOpen && (
        <div className="border-t border-white/[0.08] bg-navy-950 px-4 py-4 animate-fade-in lg:hidden">
          <div className="flex flex-col gap-1.5">
            {isStudent &&
              STUDENT_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                >
                  <Ticket className="mr-2 inline h-4 w-4" />
                  {l.label}
                </NavLink>
              ))}
            {isOrganizer && (
              <NavLink
                to="/organizer"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <CalendarDays className="mr-2 inline h-4 w-4" />
                Organizer Dashboard
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
