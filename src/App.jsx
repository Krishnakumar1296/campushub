import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OrganizerTabs from "./components/OrganizerTabs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyTickets from "./pages/MyTickets";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerEvents from "./pages/OrganizerEvents";
import CreateEvent from "./pages/CreateEvent";
import VerifyParticipant from "./pages/VerifyParticipant";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const HOME = { student: "/events", organizer: "/organizer" };

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function RequireRole({ role, children }) {
  const { auth } = useApp();
  const location = useLocation();
  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (auth.role !== role) {
    return <Navigate to={HOME[auth.role] || "/login"} replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { auth } = useApp();
  if (auth) return <Navigate to={HOME[auth.role]} replace />;
  return children;
}

function Shell() {
  const location = useLocation();
  const { auth } = useApp();
  const isOrganizer =
    auth?.role === "organizer" && location.pathname.startsWith("/organizer");
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Navbar />
      {isOrganizer && <OrganizerTabs />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/account"
            element={
              <GuestRoute>
                <SignUp />
              </GuestRoute>
            }
          />

          <Route
            path="/events"
            element={
              <RequireRole role="student">
                <Events />
              </RequireRole>
            }
          />
          <Route
            path="/event/:id"
            element={
              <RequireRole role="student">
                <EventDetails />
              </RequireRole>
            }
          />
          <Route
            path="/tickets"
            element={
              <RequireRole role="student">
                <MyTickets />
              </RequireRole>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireRole role="student">
                <Profile />
              </RequireRole>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireRole role="student">
                <SettingsPage />
              </RequireRole>
            }
          />

          <Route
            path="/organizer"
            element={
              <RequireRole role="organizer">
                <OrganizerDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/organizer/events"
            element={
              <RequireRole role="organizer">
                <OrganizerEvents />
              </RequireRole>
            }
          />
          <Route
            path="/organizer/create-event"
            element={
              <RequireRole role="organizer">
                <CreateEvent />
              </RequireRole>
            }
          />
          <Route
            path="/organizer/create-event/:id"
            element={
              <RequireRole role="organizer">
                <CreateEvent />
              </RequireRole>
            }
          />
          <Route
            path="/organizer/verify"
            element={
              <RequireRole role="organizer">
                <VerifyParticipant />
              </RequireRole>
            }
          />
          <Route
            path="/organizer/analytics"
            element={
              <RequireRole role="organizer">
                <Analytics />
              </RequireRole>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <ScrollToTop />
        <Shell />
      </ToastProvider>
    </AppProvider>
  );
}
