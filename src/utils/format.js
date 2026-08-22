const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateLong(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysUntil(iso) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function pct(a, b) {
  if (!b) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

export function fmtNum(n) {
  return new Intl.NumberFormat("en-IN").format(n ?? 0);
}

export function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function eventStatus(event) {
  if (event.status === "Draft") return { key: "draft", label: "Draft" };
  if (event.status === "Cancelled") return { key: "cancelled", label: "Cancelled" };
  if (event.status === "Completed" || daysUntil(event.date) < 0)
    return { key: "completed", label: "Completed" };
  if (event.registered >= event.capacity)
    return { key: "full", label: "Event Full" };
  if (event.registrationDeadline && daysUntil(event.registrationDeadline) < 0)
    return { key: "closed", label: "Registration Closed" };
  if (
    event.registrationDeadline &&
    daysUntil(event.registrationDeadline) <= 7
  )
    return { key: "closing", label: "Closing Soon" };
  return { key: "open", label: "Registration Open" };
}

export const CATEGORY_STYLES = {
  Technical: {
    badge: "bg-violet-600/90 text-white border-violet-300/40",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    gradient: "from-violet-500 to-indigo-600",
    accent: "#7c3aed",
  },
  Cultural: {
    badge: "bg-pink-600/90 text-white border-pink-300/40",
    chip: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
    gradient: "from-pink-500 to-fuchsia-600",
    accent: "#db2777",
  },
  Sports: {
    badge: "bg-orange-500/90 text-white border-orange-300/40",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    gradient: "from-orange-400 to-red-500",
    accent: "#f97316",
  },
  Workshop: {
    badge: "bg-cyan-600/90 text-white border-cyan-300/40",
    chip: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    gradient: "from-cyan-500 to-sky-600",
    accent: "#0891b2",
  },
  Seminar: {
    badge: "bg-sky-600/90 text-white border-sky-300/40",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    gradient: "from-sky-500 to-blue-600",
    accent: "#0284c7",
  },
  Competition: {
    badge: "bg-amber-500/90 text-white border-amber-300/40",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    gradient: "from-amber-400 to-orange-500",
    accent: "#f59e0b",
  },
  Club: {
    badge: "bg-teal-600/90 text-white border-teal-300/40",
    chip: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    gradient: "from-teal-500 to-emerald-600",
    accent: "#0d9488",
  },
  Other: {
    badge: "bg-indigo-600/90 text-white border-indigo-300/40",
    chip: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    gradient: "from-indigo-500 to-blue-600",
    accent: "#4f46e5",
  },
};
