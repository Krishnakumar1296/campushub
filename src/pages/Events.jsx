import { useMemo, useState } from "react";
import { CalendarDays, SearchX } from "lucide-react";
import { useApp } from "../context/AppContext";
import SearchBar from "../components/SearchBar";
import CategoryFilters from "../components/CategoryFilters";
import EventGrid from "../components/EventGrid";

const SORTERS = {
  upcoming: (a, b) => a.date.localeCompare(b.date),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  popular: (a, b) => b.registered - a.registered,
  closing: (a, b) =>
    (a.registrationDeadline || a.date).localeCompare(
      b.registrationDeadline || b.date
    ),
};

export default function Events() {
  const { events, loading } = useApp();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("upcoming");

  const publicEvents = useMemo(
    () => events.filter((e) => e.status !== "Draft"),
    [events]
  );

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return publicEvents;
    return publicEvents.filter((e) =>
      [e.title, e.department, e.venue].some((f) =>
        f.toLowerCase().includes(q)
      )
    );
  }, [publicEvents, search]);

  const counts = useMemo(() => {
    const c = { All: searched.length };
    searched.forEach((e) => {
      c[e.category] = (c[e.category] || 0) + 1;
    });
    return c;
  }, [searched]);

  const visible = useMemo(() => {
    const list =
      category === "All"
        ? searched
        : searched.filter((e) => e.category === category);
    return [...list].sort(SORTERS[sort] || SORTERS.upcoming);
  }, [searched, category, sort]);

  const clearFilters = () => {
    setQuery("");
    setSearch("");
    setCategory("All");
    setSort("upcoming");
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <span className="badge-soft bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <CalendarDays className="h-3.5 w-3.5" />
          Campus Events
        </span>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[34px]">
          Discover what's happening on campus
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Browse workshops, fests, competitions and club meetups. Register in
          one tap and get your QR ticket instantly.
        </p>
      </header>

      <div className="mt-7 animate-slide-up">
        <SearchBar
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          onSearch={() => setSearch(query)}
          onClear={clearFilters}
        />
      </div>

      <div className="mt-5">
        <CategoryFilters active={category} onChange={setCategory} counts={counts} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Showing{" "}
          <b className="text-slate-800 dark:text-slate-200">{visible.length}</b>{" "}
          of {publicEvents.length} events
        </p>
        {(search || category !== "All") && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold uppercase tracking-wide text-violet-600 transition hover:text-violet-700 dark:text-violet-400"
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="mt-4">
        {!loading && visible.length === 0 ? (
          <div className="card flex flex-col items-center px-6 py-20 text-center animate-scale-in">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.06]">
              <SearchX className="h-7 w-7 text-slate-400" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              No events found
            </h3>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Nothing matches your search or filters right now. Try clearing
              them to see all events.
            </p>
            <button onClick={clearFilters} className="btn-outline mt-6 px-5 py-2.5">
              Clear Filters
            </button>
          </div>
        ) : (
          <EventGrid events={visible} loading={loading} />
        )}
      </div>
    </div>
  );
}
