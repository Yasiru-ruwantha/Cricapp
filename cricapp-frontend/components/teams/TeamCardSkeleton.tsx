export function TeamCardSkeleton() {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  );
}
