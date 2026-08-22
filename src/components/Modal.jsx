import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl animate-scale-in dark:border-white/10 dark:bg-navy-900`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.07]">
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
