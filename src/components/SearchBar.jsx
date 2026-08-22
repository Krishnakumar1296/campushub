import { Search, SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Registered" },
  { value: "closing", label: "Registration Closing Soon" },
];

export default function SearchBar({
  query,
  setQuery,
  sort,
  setSort,
  onSearch,
  onClear,
}) {
  const submit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className="card flex flex-col gap-3 p-3.5 sm:p-4 lg:flex-row lg:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events by title, organizer, or venue..."
          aria-label="Search events"
          className="input h-12 pl-11"
        />
      </div>

      <div className="flex gap-3 max-lg:flex-wrap">
        <div className="relative min-w-0 sm:min-w-[210px]">
          <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort events"
            className="input h-12 cursor-pointer appearance-none pl-10 pr-9 font-medium"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort by: {o.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <button type="submit" className="btn-gradient h-12 px-6">
          <Search className="h-4 w-4" />
          Search
        </button>

        <button type="button" onClick={onClear} className="btn-outline h-12 px-5">
          Clear Filters
        </button>
      </div>
    </form>
  );
}
