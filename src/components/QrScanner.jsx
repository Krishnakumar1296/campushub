import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CameraOff, X } from "lucide-react";

const REGION_ID = "campushub-qr-reader";

export default function QrScanner({ onScan, onClose }) {
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const doneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        await Html5Qrcode.getCameras();
      } catch {
        if (!cancelled) setError("Camera access denied or unavailable.");
        return;
      }
      if (cancelled) return;

      const scanner = new Html5Qrcode(REGION_ID, { verbose: false });
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 230, height: 230 }, aspectRatio: 1 },
          (decodedText) => {
            if (doneRef.current) return;
            doneRef.current = true;
            stop().finally(() => onScanRef.current?.(decodedText));
          },
          () => {}
        );
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setError("Could not start camera. Check browser permissions.");
      }
    }

    async function stop() {
      const s = scannerRef.current;
      scannerRef.current = null;
      if (!s) return;
      try {
        await s.stop();
        s.clear();
      } catch {
        /* already stopped */
      }
    }

    start();

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return (
    <div className="card mx-auto mt-5 max-w-lg overflow-hidden animate-scale-in">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <h2 className="flex-1 text-[13px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Point camera at the student's QR code
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close scanner"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
            <CameraOff className="h-6 w-6 text-red-500" />
          </span>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{error}</p>
          <p className="text-xs text-slate-400">
            Use manual entry below, or allow camera permission and reopen.
          </p>
        </div>
      ) : (
        <div className="relative bg-slate-950">
          <div
            id={REGION_ID}
            className="[&_video]:!w-full [&_video]:!object-cover [&_img]:hidden"
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="animate-pulse text-xs font-semibold uppercase tracking-widest text-slate-400">
                Starting camera…
              </p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <div className="h-[230px] w-[230px] rounded-3xl border-2 border-white/40 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)]" />
          </div>
        </div>
      )}
    </div>
  );
}
