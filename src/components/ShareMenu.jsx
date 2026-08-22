import { useEffect, useRef, useState } from "react";
import { Share2, Link2, Mail, MessageCircle, Check } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function ShareMenu({ title, className = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const url = window.location.href;
  const text = `Check out "${title}" on CampusHub!`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    toast("Link copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setOpen(false);
        return;
      } catch {
        /* user cancelled */
      }
    }
    copyLink();
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="Share event"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-500 backdrop-blur transition-all hover:border-violet-300 hover:text-violet-600 active:scale-95 dark:border-white/15 dark:bg-white/10 dark:text-slate-200"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-30 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-scale-in dark:border-white/10 dark:bg-navy-850"
        >
          <button
            onClick={nativeShare}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Link2 className="h-4 w-4" /> Copy / Share Link
          </button>
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
              `${text}\n${url}`
            )}`}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        </div>
      )}
    </div>
  );
}
