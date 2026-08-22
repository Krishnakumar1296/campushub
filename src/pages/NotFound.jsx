import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center animate-fade-in">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
        <Compass className="h-8 w-8 text-white" />
      </span>
      <p className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
        404
      </p>
      <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved. Let's
        get you back on track.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/events" className="btn-gradient px-6 py-3">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <Link to="/" className="btn-outline px-6 py-3">
          Home
        </Link>
      </div>
    </div>
  );
}
