export function SkeletonCard() {
  return (
    <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl" />
        <div className="w-16 h-5 bg-white/5 rounded-full" />
      </div>
      <div className="h-7 bg-white/5 rounded-lg mb-2 w-1/2" />
      <div className="h-4 bg-white/5 rounded-lg w-2/3" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="border-b border-white/5 px-6 py-4 flex gap-4">
        {[3, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <div key={i} className={`h-4 bg-white/5 rounded animate-pulse ${i === 0 ? 'flex-[3]' : 'flex-1'}`} />
        ))}
      </div>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border-b border-white/5 px-6 py-4 flex gap-4 items-center"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex-[3] space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
          </div>
          {[1, 1, 1, 1, 1, 1].map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonReport() {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-900 border border-white/5 rounded-2xl animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded w-48" />
          <div className="h-3 bg-white/5 rounded w-32" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 bg-white/5 rounded-full w-24 hidden md:block" />
        <div className="h-9 bg-white/5 rounded-xl w-24" />
      </div>
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-5 bg-white/5 rounded w-40" />
          <div className="h-3 bg-white/5 rounded w-28" />
        </div>
        <div className="h-7 bg-white/5 rounded-full w-36" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {[60, 80, 55, 90, 70, 85, 75, 95, 65, 88, 72, 92].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-white/5 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2 animate-pulse">
        <div className="h-7 bg-white/5 rounded w-48" />
        <div className="h-4 bg-white/5 rounded w-72" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonChart />
      <SkeletonChart />
    </div>
  )
}