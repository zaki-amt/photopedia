"use client";

import React from "react";

export function PostCardSkeleton() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm space-y-3 font-sans">
      {/* Header Bar Skeleton */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full shimmer-effect shrink-0" />
          <div className="space-y-1.5">
            <div className="w-28 h-3.5 rounded shimmer-effect" />
            <div className="w-20 h-2.5 rounded shimmer-effect" />
          </div>
        </div>
        <div className="w-16 h-5 rounded shimmer-effect" />
      </div>

      {/* Media Image Box Skeleton */}
      <div className="w-full aspect-[16/10] shimmer-effect" />

      {/* Footer Caption & Actions Skeleton */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="w-3/4 h-3 rounded shimmer-effect" />
          <div className="w-1/2 h-3 rounded shimmer-effect" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="w-16 h-6 rounded-lg shimmer-effect" />
            <div className="w-12 h-6 rounded-lg shimmer-effect" />
          </div>
          <div className="w-20 h-6 rounded-lg shimmer-effect" />
        </div>
      </div>
    </div>
  );
}

export function PostFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
