
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: {
    icon: "text-emerald-500",
    bar: "bg-emerald-500",
  },
  error: {
    icon: "text-red-500",
    bar: "bg-red-500",
  },
  info: {
    icon: "text-sky-500",
    bar: "bg-sky-500",
  },
  warning: {
    icon: "text-amber-500",
    bar: "bg-amber-500",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    },
    []
  );

  const toast = useCallback(
    (message, type = "success", duration = 3800) => {
      const id = ++toastId;
      setToasts((t) => [...t.slice(-3), { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[calc(100vw-40px)] max-w-sm flex-col gap-2.5">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          const s = STYLES[t.type] || STYLES.info;
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 p-4 pr-10 shadow-xl shadow-slate-900/10 backdrop-blur animate-slide-in-right dark:border-white/10 dark:bg-navy-850/95"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${s.bar}`} />
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.icon}`} />
              <p className="text-sm font-medium leading-snug text-slate-700 dark:text-slate-200">
                {t.message}
              </p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="absolute right-2 top-2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
