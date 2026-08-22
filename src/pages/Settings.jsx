import { useState } from "react";
import {
  BellRing,
  Info,
  Mail,
  Megaphone,
  Moon,
  RotateCcw,
  Sun,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import useLocalStorage from "../hooks/useLocalStorage";

const DEFAULT_PREFS = {
  emailUpdates: true,
  reminders: true,
  announcements: false,
};

export default function Settings() {
  const { theme, toggleTheme, resetDemoData } = useApp();
  const toast = useToast();
  const [prefs, setPrefs] = useLocalStorage("ch_prefs_v1", DEFAULT_PREFS);
  const [confirmReset, setConfirmReset] = useState(false);

  const togglePref = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast(
      `${PREF_META.find((m) => m.key === key).label} turned ${
        !prefs[key] ? "on" : "off"
      }.`,
      "info"
    );
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[34px]">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Personalize CampusHub — appearance, notifications and demo data.
        </p>
      </header>

      <section className="card mt-7 p-6 animate-slide-up">
        <SectionHead icon={theme === "dark" ? Moon : Sun} title="Appearance" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ThemeCard
            active={theme === "light"}
            onClick={() => theme === "dark" && toggleTheme()}
            icon={Sun}
            title="Light"
            desc="Bright campus daylight look"
          />
          <ThemeCard
            active={theme === "dark"}
            onClick={() => theme === "light" && toggleTheme()}
            icon={Moon}
            title="Dark"
            desc="Easy on the eyes at night"
          />
        </div>
      </section>

      <section className="card mt-5 p-6 animate-slide-up">
        <SectionHead icon={BellRing} title="Notifications" />
        <div className="mt-3 divide-y divide-slate-100 dark:divide-white/[0.06]">
          {PREF_META.map((p) => {
            const Icon = p.icon;
            return (
              <ToggleRow
                key={p.key}
                icon={Icon}
                title={p.label}
                desc={p.desc}
                on={prefs[p.key]}
                onToggle={() => togglePref(p.key)}
              />
            );
          })}
        </div>
      </section>

      <section className="card mt-5 border-red-200 p-6 animate-slide-up dark:border-red-500/20">
        <SectionHead icon={RotateCcw} title="Danger Zone" danger />
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Reset events, registrations and notifications back to the original
            demo data. This cannot be undone.
          </p>
          <button
            onClick={() => setConfirmReset(true)}
            className="btn-danger shrink-0 px-5 py-2.5"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </button>
        </div>
      </section>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-violet-50 px-4 py-3.5 text-xs leading-relaxed text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        CampusHub v1.0 — a demo campus event portal. All data is stored locally
        in your browser.
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          toast("Resetting demo data…", "info");
          resetDemoData();
        }}
        title="Reset Demo Data"
        message="All local changes — new events, registrations and settings data — will be wiped and replaced with seed data. Continue?"
        confirmLabel="Yes, reset everything"
      />
    </div>
  );
}

const PREF_META = [
  {
    key: "emailUpdates",
    label: "Email updates",
    desc: "Registration confirmations and receipts",
    icon: Mail,
  },
  {
    key: "reminders",
    label: "Event reminders",
    desc: "Get notified before your events start",
    icon: BellRing,
  },
  {
    key: "announcements",
    label: "New event announcements",
    desc: "Alerts when organizers publish fresh events",
    icon: Megaphone,
  },
];

function SectionHead({ icon: Icon, title, danger }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-100 text-red-500 dark:bg-red-500/15 dark:text-red-400"
            : "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

function ThemeCard({ active, onClick, icon: Icon, title, desc }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
        active
          ? "border-violet-400 bg-violet-50 ring-2 ring-violet-500/20 dark:border-violet-400/50 dark:bg-violet-500/10"
          : "border-slate-200 hover:border-violet-300 dark:border-white/[0.08] dark:hover:border-violet-400/40"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          active
            ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
            : "bg-slate-100 text-slate-400 dark:bg-white/[0.07]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold text-slate-800 dark:text-white">
          {title}
          {active && <span className="ml-2 text-xs font-semibold text-violet-500">Active</span>}
        </span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{desc}</span>
      </span>
    </button>
  );
}

function ToggleRow({ icon: Icon, title, desc, on, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-violet-500 dark:text-violet-400" />
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
          on ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-slate-200 dark:bg-white/[0.12]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
