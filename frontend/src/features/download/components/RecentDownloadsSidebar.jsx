import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/SkeletonLoader';

/**
 * "Your Recent Downloads" mini-list sidebar card — shown on the Video Preview page.
 * Uses shimmer skeletons to simulate loading items (will connect to real history data).
 */
export function RecentDownloadsSidebar() {
  return (
    <GlassCard className="p-md border border-outline-variant/20 text-left">
      <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md">
        Your Recent Downloads
      </h4>
      <div className="space-y-sm">
        {/* Shimmer loading placeholder rows */}
        <div className="flex gap-sm items-center">
          <Skeleton className="w-12 h-12 shrink-0" rounded="lg" />
          <div className="flex-grow">
            <Skeleton className="h-4 w-3/4 mb-xs" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <div className="flex gap-sm items-center opacity-60">
          <div className="w-12 h-12 rounded-lg bg-surface-container shrink-0" />
          <div className="flex-grow">
            <div className="h-4 w-2/3 bg-surface-container rounded mb-xs" />
            <div className="h-3 w-1/3 bg-surface-container rounded" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
