import EventCard from "./EventCard";

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/9] animate-pulse bg-slate-200 dark:bg-white/[0.06]" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-white/[0.06]" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-white/[0.04]" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-white/[0.04]" />
        <div className="grid gap-2 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-white/[0.04]" />
          ))}
        </div>
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-100 dark:bg-white/[0.04]" />
        <div className="!mt-5 h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-white/[0.06]" />
      </div>
    </div>
  );
}

export { SkeletonCard };

export default function EventGrid({ events, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((e, i) => (
        <div key={e.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
          <EventCard event={e} />
        </div>
      ))}
    </div>
  );
}
