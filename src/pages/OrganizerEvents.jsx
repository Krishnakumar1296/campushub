import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { CATEGORIES } from "../data/events";
import { CATEGORY_STYLES, eventStatus, formatDate, pct } from "../utils/format";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open / Closing" },
  { value: "full", label: "Full" },
  { value: "closed", label: "Closed" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Drafts" },
];

export default function OrganizerEvents() {
  const navigate = useNavigate();
  const { events, deleteEvent, addNotification } = useApp();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [statusKey, setStatusKey] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => category === "All" || e.category === category)
      .filter((e) => statusKey === "all" || eventStatus(e).key === statusKey)
      .filter(
        (e) =>
          !q ||
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, query, category, statusKey]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const ok = await deleteEvent(pendingDelete.id);
    if (!ok) {
      toast("Could not delete the event. Is the server running?", "error");
      return;
    }
    toast(`"${pendingDelete.title}" and its registrations were deleted.`, "success");
    addNotification({
      type: "warning",
      title: "Event deleted",
      message: `"${pendingDelete.title}" was removed by the organizer.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Events
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {events.length} events • edit details, track seats or remove old listings.
          </p>
        </div>
        <Link to="/organizer/create-event" className="btn-gradient px-5 py-2.5">
          <PlusCircle className="h-4 w-4" />
          Create Event
        </Link>
      </header>

      <div className="card mt-6 flex flex-col gap-3 p-3.5 sm:p-4 lg:flex-row lg:items-center animate-slide-up">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or venue..."
            aria-label="Search my events"
            className="input h-11 pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="input h-11 cursor-pointer font-medium lg:w-48"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              Category: {c.label}
            </option>
          ))}
        </select>
        <select
          value={statusKey}
          onChange={(e) => setStatusKey(e.target.value)}
          aria-label="Filter by status"
          className="input h-11 cursor-pointer font-medium lg:w-52"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <section className="card mt-5 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead className="border-b border-slate-200/70 bg-slate-50/60 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <tr>
                <th className="th">Event</th>
                <th className="th">Date</th>
                <th className="th">Category</th>
                <th className="th">Seats</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filtered.map((e) => {
                const style =
                  CATEGORY_STYLES[e.category] || CATEGORY_STYLES.Other;
                const status = eventStatus(e);
                const fill = pct(e.registered, e.capacity);
                return (
                  <tr
                    key={e.id}
                    className="transition-colors hover:bg-violet-50/50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.image}
                          alt=""
                          loading="lazy"
                          className="h-11 w-16 shrink-0 rounded-lg object-cover shadow-sm"
                        />
                        <div className="min-w-0">
                          <p className="max-w-[240px] truncate text-[13px] font-bold text-slate-800 dark:text-slate-100">
                            {e.title}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {e.department} • {e.venue}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="td text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-violet-500" />
                        {formatDate(e.date)}
                      </span>
                    </td>
                    <td className="td">
                      <span className={`badge-soft ${style.chip}`}>{e.category}</span>
                    </td>
                    <td className="td min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${style.gradient}`}
                            style={{ width: `${fill}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {e.registered}/{e.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="td">
                      <span
                        className={`badge-soft ${
                          status.key === "open"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : status.key === "closing"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                            : status.key === "draft"
                            ? "bg-slate-200 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300"
                            : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="td">
                      <div className="flex items-center justify-end gap-1.5">
                        <IconAction
                          label={`View ${e.title}`}
                          onClick={() => navigate(`/event/${e.id}`)}
                          icon={Eye}
                        />
                        <IconAction
                          label={`Edit ${e.title}`}
                          onClick={() => navigate(`/organizer/create-event/${e.id}`)}
                          icon={Pencil}
                        />
                        <button
                          onClick={() => setPendingDelete(e)}
                          aria-label={`Delete ${e.title}`}
                          title="Delete"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="td py-14 text-center text-sm text-slate-400">
                    No events match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message={
          pendingDelete
            ? `Permanently delete "${pendingDelete.title}"? All of its registrations will be removed too.`
            : ""
        }
      />
    </div>
  );
}

function IconAction({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 active:scale-90 dark:hover:bg-white/[0.07] dark:hover:text-violet-300"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
