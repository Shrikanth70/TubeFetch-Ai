/**
 * Shimmer skeleton placeholder — used during loading states
 * to match the Stitch loading UI.
 */

export function Skeleton({ className = '', rounded = 'lg' }) {
  const roundedMap = { sm: 'rounded', lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full' };
  return <div className={`shimmer ${roundedMap[rounded]} ${className}`} />;
}

export function SkeletonHistoryItem() {
  return (
    <div className="glass-card p-4 rounded-2xl flex gap-6 items-center">
      <Skeleton className="w-56 h-32 shrink-0" rounded="xl" />
      <div className="flex-grow space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2 w-32">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function SkeletonVideoPreview() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full aspect-video" rounded="xl" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
