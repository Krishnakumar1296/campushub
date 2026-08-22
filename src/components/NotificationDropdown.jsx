import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, PartyPopper, Ticket, AlertTriangle, Megaphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import { timeAgo } from "../utils/format";

const TYPE_META = {
  success: { icon: Ticket, cls: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" },
  info: { icon: PartyPopper, cls: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400" },
  warning: { icon: AlertTriangle, cls: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" },
  event: { icon: Megaphone, cls: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400" },
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        className="icon-btn"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-1 text-[10px] font-bold text-white shadow-md shadow-red-900/40">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] max-w-[calc(100vw-32px)] origin-top-right overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/15 animate-scale-in dark:border-white/10 dark:bg-navy-850 dark:shadow-black/50">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-white/[0.07]">
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-white/5"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto p-1.5">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-400">
                You're all caught up.
              </p>
            ) : (
              notifications.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.info;
                return (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
                      !n.read ? "bg-violet-50/[0.6] dark:bg-violet-500/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.cls}`}
                    >
                      <meta.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {n.message}
                      </span>
                      <span className="mt-1 block text-[11px] font-medium text-slate-400">
                        {timeAgo(n.time)}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
