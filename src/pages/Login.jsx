import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  LogIn,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
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

export default function Login() {
  const { loginAs } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const meta = ROLE_META[role];

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        setError(res.error || "Login failed.");
        return;
      }
      const user = loginAs(res.user);
      navigate(location.state?.from || (user.role === "organizer" ? "/organizer" : "/events"), {
        replace: true,
      });
    } catch {
      setError("Cannot reach the server. Make sure the API server and MongoDB are running.");
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
              One portal.
              <br />
              Two experiences.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
              Students discover and register. Organizers publish and verify.
              Sign in with the right account to see your workspace.
            </p>
          </div>
          <ul className="space-y-3">
            {meta.perks.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm font-medium">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <ShieldCheck className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </aside>

        <section className="p-7 sm:p-9">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign in to CampusHub
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Choose how you want to log in.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3" role="tablist" aria-label="Login type">
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
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@college.edu"
                  autoComplete="username"
                  className="input h-11 pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <button type="submit" disabled={busy} className="btn-gradient h-12 w-full">
              <LogIn className="h-4 w-4" />
              {busy ? "Signing in…" : `Sign in as ${meta.label}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            New to CampusHub?{" "}
            <Link
              to="/account"
              className="font-bold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
