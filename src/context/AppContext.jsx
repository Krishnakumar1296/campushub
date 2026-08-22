import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { api } from "../utils/api";

const AppContext = createContext(null);

const titleCase = (r) => (r ? r.charAt(0).toUpperCase() + r.slice(1) : "");

export function AppProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useLocalStorage("ch_theme", "light");
  const [view, setView] = useLocalStorage("ch_view", "student");
  const [auth, setAuth] = useLocalStorage("ch_auth_v1", null);
  const [profile, setProfile] = useState(() =>
    auth
      ? {
          id: auth.id || "",
          name: auth.name || "",
          email: auth.email || "",
          role: titleCase(auth.role),
          phone: "",
          department: "",
          year: "",
          bio: "",
        }
      : null
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const refreshEvents = useCallback(async () => {
    const data = await api("/events.php");
    setEvents(data);
    return data;
  }, []);

  const refreshRegistrations = useCallback(async () => {
    const data = await api("/registrations.php");
    setRegistrations(data);
    return data;
  }, []);

  const refreshNotifications = useCallback(async (email) => {
    if (!email) return;
    const data = await api(`/notifications.php?email=${encodeURIComponent(email)}`);
    setNotifications(data);
    return data;
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([refreshEvents(), refreshRegistrations()])
      .catch((err) => console.error("Backend unreachable:", err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [refreshEvents, refreshRegistrations]);

  useEffect(() => {
    if (!auth?.email) {
      setNotifications([]);
      return;
    }
    refreshNotifications(auth.email).catch(() => {});
  }, [auth?.email, auth?.role, refreshNotifications]);

  useEffect(() => {
    if (!auth?.id) return;
    api(`/profile.php?id=${encodeURIComponent(auth.id)}`)
      .then((res) => {
        if (res?.ok && res.profile) {
          setProfile((p) => ({
            ...p,
            ...res.profile,
            role: titleCase(res.profile.role),
          }));
        }
      })
      .catch(() => {});
  }, [auth?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const myRegistrations = useMemo(
    () =>
      profile
        ? registrations
            .filter((r) => r.studentId === profile.id)
            .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
        : [],
    [registrations, profile]
  );

  const getEvent = (id) => events.find((e) => String(e.id) === String(id));

  const getRegistration = (regId) =>
    registrations.find(
      (r) => r.regId.toLowerCase() === String(regId || "").toLowerCase()
    );

  const addNotification = useCallback(
    async (n) => {
      try {
        await api("/notifications.php", {
          method: "POST",
          body: JSON.stringify({
            userEmail: auth?.email || null,
            type: "info",
            ...n,
          }),
        });
      } catch {
        /* non-fatal */
      }
    },
    [auth?.email]
  );

  const registerForEvent = async (eventId) => {
    const event = getEvent(eventId);
    if (!event) return { ok: false, error: "Event not found." };
    const res = await api("/register.php", {
      method: "POST",
      body: JSON.stringify({
        eventId: event.id,
        student: {
          id: profile?.id || "",
          name: profile?.name || "",
          email: profile?.email || "",
          department: profile?.department || "",
          year: profile?.year || "",
        },
      }),
    }).catch((err) => ({ ok: false, error: err.payload?.error || err.message }));
    if (res.ok) {
      await Promise.all([
        refreshEvents(),
        refreshRegistrations(),
        refreshNotifications(auth?.email),
      ]).catch(() => {});
    }
    return res;
  };

  const markAttendance = async (regId) => {
    let res;
    try {
      res = await api("/checkin.php", {
        method: "POST",
        body: JSON.stringify({ regId }),
      });
    } catch (err) {
      console.error(err.message);
      return null;
    }
    if (res.ok && res.registration) {
      setRegistrations((list) =>
        list.map((r) =>
          r.regId === res.registration.regId ? res.registration : r
        )
      );
      refreshEvents().catch(() => {});
      refreshNotifications(auth?.email).catch(() => {});
      return res.registration;
    }
    return null;
  };

  const addEvent = async (data) => {
    try {
      const res = await api("/events.php", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok && res.event) {
        setEvents((list) => [...list, res.event]);
        return res.event;
      }
      return null;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  const updateEvent = async (id, data) => {
    await api(`/events.php?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setEvents((list) =>
      list.map((e) => (String(e.id) === String(id) ? { ...e, ...data } : e))
    );
    return true;
  };

  const deleteEvent = async (id) => {
    try {
      const res = await api(`/events.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) return false;
      setEvents((list) => list.filter((e) => String(e.id) !== String(id)));
      setRegistrations((list) => list.filter((r) => String(r.eventId) !== String(id)));
      return true;
    } catch {
      return false;
    }
  };

  const updateProfile = async (data) => {
    await api("/profile.php", {
      method: "PUT",
      body: JSON.stringify({ id: auth?.id || profile?.id || "", ...data }),
    });
    setProfile((p) => ({ ...p, ...data }));
    if (data.email && auth) setAuth({ ...auth, email: data.email });
    return true;
  };

  const markNotificationRead = async (id) => {
    setNotifications((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (auth?.email) {
      api("/notifications.php", {
        method: "PATCH",
        body: JSON.stringify({ id, email: auth.email }),
      }).catch(() => {});
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    if (auth?.email) {
      api("/notifications.php", {
        method: "PATCH",
        body: JSON.stringify({ all: true, email: auth.email }),
      }).catch(() => {});
    }
  };

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const loginAs = (user) => {
    setAuth(user);
    setView(user.role);
    return user;
  };

  const logout = () => setAuth(null);

  const resetDemoData = async () => {
    try {
      await api("/reset.php");
    } catch (err) {
      console.error(err.message);
    }
    window.location.reload();
  };

  const value = {
    loading,
    theme,
    toggleTheme,
    view,
    setView,
    events,
    profile,
    setProfile,
    notifications,
    unreadCount,
    myRegistrations,
    registrations,
    getEvent,
    getRegistration,
    registerForEvent,
    markAttendance,
    addEvent,
    updateEvent,
    deleteEvent,
    updateProfile,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    auth,
    loginAs,
    logout,
    refreshEvents,
    refreshRegistrations,
    refreshNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
