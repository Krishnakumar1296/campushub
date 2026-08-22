import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../utils/api";

const ROLE_META = {
  student: {
    label: "Student",
    tagline: "Discover events & grab tickets",
    perks: [
      "Browse campus events by category",
      "One-tap registration with QR tickets",
      "Track all your passes in one place",
    ],
    icon: GraduationCap,
    gradient: "from-violet-500 to-indigo-600",
  },
  organizer: {
    label: "Organizer",
    tagline: "Run events end-to-end",
    perks: [
      "Create & manage event listings",
      "Verify attendees with QR check-in",
      "Deep analytics on registrations",
    ],
    icon: Megaphone,
    gradient: "from-fuchsia-500 to-purple-700",
  },
};

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Comm.",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Mass Communication",
  "Business Administration",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function SignUp() {
  const { loginAs } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const meta = ROLE_META[role];
  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (form.name.trim().length < 3) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return "Please enter a valid email address.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirm)
      return "Passwords do not match.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await api("/signup.php", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role,
          department: role === "student" ? form.department : "",
          year: role === "student" ? form.year : "",
        }),
      });
      if (!res.ok) {
        setError(res.error || "Could not create the account.");
        return;
      }
      loginAs(res.user);
      navigate(res.user.role === "organizer" ? "/organizer" : "/events", {
        replace: true,
      });
    } catch {
      setError("Cannot reach the server. Make sure XAMPP (Apache + MySQL) is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1000px] items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="card grid w-full overflow-hidden lg:grid-cols-[1fr_1.1fr]">
        <aside
          className={`relative hidden flex-col justify-between bg-gradient-to-br ${meta.gradient} p-8 text-white transition-colors duration-500 lg:flex`}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/10"
            aria-hidden="true"
          />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              CampusHub Portal
            </span>
            <h2 className="mt-6 text-[26px] font-extrabold leading-tight tracking-tight">
              Join CampusHub.
              <br />
              It takes a minute.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
              Create a free account as a student or an organizer and unlock
              your campus workspace.
            </p>
          </div>
          <ul className="space-y-3">
            {meta.perks.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm font-medium">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </aside>

        <section className="p-7 sm:p-9">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Pick an account type to get started.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3" role="tablist" aria-label="Account type">
            {Object.keys(ROLE_META).map((r) => {
              const m = ROLE_META[r];
              const Icon = m.icon;
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setRole(r);
                    setError("");
                  }}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                    active
                      ? `border-transparent bg-gradient-to-br ${m.gradient} text-white shadow-lg shadow-violet-500/25`
                      : "border-slate-200 hover:border-violet-300 dark:border-white/[0.08] dark:hover:border-violet-400/40"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-white" : "text-violet-500 dark:text-violet-400"
                    }`}
                  />
                  <span
                    className={`mt-2 block text-sm font-bold ${
                      active ? "text-white" : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] leading-snug ${
                      active ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    {m.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold leading-relaxed text-red-600 animate-fade-in dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            )}

            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Priya Sharma"
                autoComplete="name"
                className="input h-11"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@college.edu"
                  autoComplete="email"
                  className="input h-11 pl-10"
                  required
                />
              </div>
            </div>

            {role === "student" && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label className="label">Department</label>
                  <select value={form.department} onChange={set("department")} className="input h-11">
                    <option value="">Select…</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Year</label>
                  <select value={form.year} onChange={set("year")} className="input h-11">
                    <option value="">Select…</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className="input h-11 pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="input h-11"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-gradient h-12 w-full">
              <UserPlus className="h-4 w-4" />
              {busy ? "Creating account…" : `Create ${meta.label.toLowerCase()} account`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            Your password is stored securely (hashed) — never in plain text.
          </p>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
