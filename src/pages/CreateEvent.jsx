import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarPlus,
  Eye,
  ImageOff,
  Pencil,
  Save,
  XCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { CATEGORIES } from "../data/events";
import { CATEGORY_STYLES, formatDate } from "../utils/format";

const BLANK = {
  title: "",
  category: "Technical",
  date: "",
  time: "",
  endTime: "",
  venue: "",
  department: "",
  capacity: "",
  registrationDeadline: "",
  image: "",
  description: "",
  longDescription: "",
  tags: "",
  status: "Upcoming",
};

const STATUSES = ["Upcoming", "Draft", "Completed", "Cancelled"];

export default function CreateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, addEvent, updateEvent, loading } = useApp();
  const toast = useToast();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  const editing = Boolean(id);
  const existing = editing ? getEvent(id) : undefined;

  useEffect(() => {
    if (!editing) {
      setForm(BLANK);
      return;
    }
    if (existing) {
      setForm({
        ...BLANK,
        ...existing,
        tags: (existing.tags || []).join(", "),
        capacity: String(existing.capacity ?? ""),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.date) errs.date = "Date is required.";
    if (!form.time.trim()) errs.time = "Start time is required.";
    if (!form.venue.trim()) errs.venue = "Venue is required.";
    if (!form.department.trim()) errs.department = "Department / club is required.";
    if (!form.capacity || Number(form.capacity) < 1)
      errs.capacity = "Capacity must be at least 1.";
    if (
      form.registrationDeadline &&
      form.date &&
      form.registrationDeadline > form.date
    )
      errs.registrationDeadline = "Deadline can't be after the event date.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields.", "error");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || form.title.trim(),
      longDescription: form.longDescription.trim(),
      category: form.category,
      date: form.date,
      time: form.time.trim(),
      endTime: form.endTime.trim(),
      venue: form.venue.trim(),
      department: form.department.trim(),
      image:
        form.image.trim() ||
        `https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80`,
      registered: existing?.registered ?? 0,
      attended: existing?.attended ?? 0,
      registrationDeadline: form.registrationDeadline || form.date,
      status: form.status,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editing) {
      try {
        await updateEvent(id, payload);
        toast("Event updated successfully.", "success");
      } catch {
        toast("Could not update the event. Is the server running?", "error");
        return;
      }
    } else {
      const created = await addEvent(payload);
      if (!created) {
        toast("Could not publish the event. Is the server running?", "error");
        return;
      }
      toast(`"${created.title}" published successfully.`, "success");
    }
    navigate("/organizer/events");
  };

  const style = useMemo(
    () => CATEGORY_STYLES[form.category] || CATEGORY_STYLES.Other,
    [form.category]
  );

  if (editing && !existing) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 py-24 text-center animate-fade-in">
        {loading ? (
          <>
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading event details…
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Event not found
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This event may have been removed or the link is incorrect.
            </p>
            <button
              onClick={() => navigate("/organizer/events")}
              className="btn-gradient mt-6 px-6 py-3"
            >
              Back to My Events
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center gap-4 animate-fade-in">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25">
          {editing ? (
            <Pencil className="h-[22px] w-[22px]" />
          ) : (
            <CalendarPlus className="h-[22px] w-[22px]" />
          )}
        </span>
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {editing ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {editing
              ? "Update the details below — students see changes instantly."
              : "Fill in the details to publish your event to the campus."}
          </p>
        </div>
      </header>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} noValidate className="card space-y-5 p-6 animate-slide-up">
          <Field label="Event Title" error={errors.title} required>
            <input
              className="input"
              placeholder="e.g. Annual Hackathon 2026"
              value={form.title}
              onChange={set("title")}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" required>
              <select className="input cursor-pointer font-medium" value={form.category} onChange={set("category")}>
                {CATEGORIES.filter((c) => c.value !== "All").map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className="input cursor-pointer font-medium" value={form.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Date" error={errors.date} required>
              <input type="date" className="input" value={form.date} onChange={set("date")} />
            </Field>
            <Field label="Start Time" error={errors.time} required>
              <input
                className="input"
                placeholder="10:00 AM"
                value={form.time}
                onChange={set("time")}
              />
            </Field>
            <Field label="End Time">
              <input
                className="input"
                placeholder="04:00 PM"
                value={form.endTime}
                onChange={set("endTime")}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Venue" error={errors.venue} required>
              <input
                className="input"
                placeholder="Main Auditorium"
                value={form.venue}
                onChange={set("venue")}
              />
            </Field>
            <Field label="Organizing Department / Club" error={errors.department} required>
              <input
                className="input"
                placeholder="CSE Department"
                value={form.department}
                onChange={set("department")}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Capacity" error={errors.capacity} required>
              <input
                type="number"
                min="1"
                className="input"
                placeholder="150"
                value={form.capacity}
                onChange={set("capacity")}
              />
            </Field>
            <Field label="Registration Deadline" error={errors.registrationDeadline}>
              <input
                type="date"
                className="input"
                value={form.registrationDeadline}
                onChange={set("registrationDeadline")}
              />
            </Field>
          </div>

          <Field
            label="Image URL"
            hint="Leave empty to use a default campus banner."
          >
            <input
              className="input"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={set("image")}
            />
          </Field>

          <Field label="Short Description" hint="Shown on event cards (1–2 lines).">
            <textarea
              rows={2}
              className="input resize-none"
              placeholder="A quick summary of the event..."
              value={form.description}
              onChange={set("description")}
            />
          </Field>

          <Field label="Full Description">
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="Agenda, speakers, rules, prizes..."
              value={form.longDescription}
              onChange={set("longDescription")}
            />
          </Field>

          <Field label="Tags" hint="Comma separated, e.g. AI, Hackathon, Coding">
            <input
              className="input"
              placeholder="AI, Hackathon"
              value={form.tags}
              onChange={set("tags")}
            />
          </Field>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => navigate("/organizer/events")}
              className="btn-outline px-5 py-2.5"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
            <button type="submit" className="btn-gradient px-6 py-2.5">
              {editing ? <Save className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
              {editing ? "Save Changes" : "Publish Event"}
            </button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-[140px] lg:self-start animate-slide-up">
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Eye className="h-4 w-4" />
            Live preview
          </p>
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/10] bg-slate-100 dark:bg-white/[0.05]">
              {form.image ? (
                <img
                  src={form.image}
                  alt=""
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="h-full w-full object-cover"
                />
              ) : null}
              {!form.image && (
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${style.gradient}`}>
                  <ImageOff className="h-8 w-8 text-white/60" />
                </div>
              )}
              <span
                className={`absolute left-3 top-3 rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${style.badge}`}
              >
                {form.category}
              </span>
              <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                {form.status}
              </span>
            </div>
            <div className="space-y-2 p-4 text-[13px]">
              <h3 className="truncate font-bold text-slate-900 dark:text-white">
                {form.title || "Your event title"}
              </h3>
              <PreviewRow label="Date" value={form.date ? formatDate(form.date) : "—"} extra={form.time} />
              <PreviewRow label="Venue" value={form.venue || "—"} />
              <PreviewRow label="By" value={form.department || "—"} />
              <PreviewRow
                label="Seats"
                value={`${existing?.registered ?? 0} / ${Number(form.capacity) || 0}`}
              />
              {form.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span key={t} className={`badge-soft ${style.chip}`}>
                        #{t}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children, error, hint, required }) {
  return (
    <div>
      <label className="label flex items-center justify-between">
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-400">*</span>}
        </span>
        {hint && <span className="normal-case tracking-normal text-slate-400">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}

function PreviewRow({ label, value, extra }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-100 pb-1.5 last:border-none dark:border-white/[0.06]">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="truncate text-right font-semibold text-slate-700 dark:text-slate-200">
        {value}
        {extra ? <span className="font-normal text-slate-400"> • {extra}</span> : null}
      </span>
    </div>
  );
}
