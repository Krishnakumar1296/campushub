import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Ticket as TicketIcon,
  TicketPlus,
  UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import StatsCard from "../components/StatsCard";
import TicketRow, { AvatarInitials } from "../components/TicketCard";
import { initials } from "../utils/format";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  bio: "",
};

export default function Profile() {
  const location = useLocation();
  const { profile, setProfile, myRegistrations, notifications, updateProfile } = useApp();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (location.hash === "#registrations") {
      document
        .getElementById("registrations")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const openEdit = () => {
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      department: profile.department || "",
      year: profile.year || "",
      bio: profile.bio || "",
    });
    setEditOpen(true);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const saveProfile = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast("Name and email are required.", "error");
      return;
    }
    const clean = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    };
    try {
      await updateProfile(clean);
    } catch {
      toast("Could not save profile. Is the server running?", "error");
      return;
    }
    setProfile((p) => ({ ...p, ...clean }));
    setEditOpen(false);
    toast("Profile updated successfully.", "success");
  };

  const checkedIn = myRegistrations.filter(
    (r) => r.status === "Checked-in"
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <span className="badge-soft bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <UserRound className="h-3.5 w-3.5" />
          My Profile
        </span>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[34px]">
          Account overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Manage your personal details and review your event activity.
        </p>
      </header>

      <section className="card mt-7 overflow-hidden animate-slide-up">
        <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
        <div className="-mt-10 flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <span className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-extrabold text-white shadow-lg shadow-violet-500/30 dark:border-navy-900">
              {initials(profile.name)}
            </span>
            <div className="pb-1.5">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {profile.role} • {profile.id}
                </span>
              </p>
            </div>
          </div>
          <button onClick={openEdit} className="btn-gradient shrink-0 px-5 py-2.5">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid gap-px border-t border-slate-200/70 bg-slate-200/60 dark:border-white/[0.07] dark:bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile icon={Mail} label="Email" value={profile.email} />
          <InfoTile icon={Phone} label="Phone" value={profile.phone} />
          <InfoTile icon={Building2} label="Department" value={profile.department} />
          <InfoTile icon={GraduationCap} label="Year" value={profile.year} />
        </div>

        {profile.bio && (
          <div className="border-t border-slate-200/70 px-6 py-5 dark:border-white/[0.07]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Bio
            </p>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {profile.bio}
            </p>
          </div>
        )}
      </section>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          icon={TicketIcon}
          label="Total registrations"
          value={myRegistrations.length}
          tint="violet"
        />
        <StatsCard
          icon={BadgeCheck}
          label="Checked-in events"
          value={checkedIn}
          tint="green"
          sub="Verified via QR at venue"
        />
        <StatsCard
          icon={UserRound}
          label="Unread notifications"
          value={notifications.filter((n) => !n.read).length}
          tint="blue"
          sub="From the bell menu above"
        />
      </div>

      <section id="registrations" className="mt-9 scroll-mt-32">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            My Registrations
          </h2>
          <span className="badge-soft bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
            {myRegistrations.length} total
          </span>
        </div>

        {myRegistrations.length === 0 ? (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06]">
              <TicketPlus className="h-6 w-6 text-slate-400" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No registrations yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Events you register for will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {myRegistrations.map((r, i) => (
              <div
                key={r.regId}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <TicketRow registration={r} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
          className="space-y-4"
        >
          <div className="mb-1 flex items-center gap-3 rounded-xl bg-violet-50 p-3 dark:bg-violet-500/10">
            <AvatarInitials name={form.name || profile.name} />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Your details appear on tickets and are shared with organizers
              during check-in.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className="label">Department</label>
              <input
                className="input"
                value={form.department}
                onChange={set("department")}
              />
            </div>
            <div>
              <label className="label">Year</label>
              <input
                className="input"
                placeholder="e.g. 3rd Year"
                value={form.year}
                onChange={set("year")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Bio</label>
              <textarea
                rows={3}
                className="input resize-none"
                placeholder="A short intro about you..."
                value={form.bio}
                onChange={set("bio")}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="btn-outline px-5 py-2.5"
            >
              Cancel
            </button>
            <button type="submit" className="btn-gradient px-5 py-2.5">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="bg-white px-6 py-4 dark:bg-navy-900">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value || "—"}
      </p>
    </div>
  );
}
