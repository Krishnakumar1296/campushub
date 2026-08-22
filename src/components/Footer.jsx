import { CalendarDays, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/70 py-6 dark:border-white/[0.06]">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
            <CalendarDays className="h-3.5 w-3.5 text-white" />
          </span>
          © 2026 CampusHub — Campus Event Portal
        </p>
        <div className="flex items-center gap-5 font-medium">
          <a href="#top" onClick={(e) => e.preventDefault()} className="transition hover:text-violet-500">
            About
          </a>
          <a href="#top" onClick={(e) => e.preventDefault()} className="transition hover:text-violet-500">
            Support
          </a>
          <a href="#top" onClick={(e) => e.preventDefault()} className="transition hover:text-violet-500">
            Privacy
          </a>
          <span className="hidden items-center gap-1.5 sm:flex">
            Made with <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" /> for campuses
          </span>
        </div>
      </div>
    </footer>
  );
}
