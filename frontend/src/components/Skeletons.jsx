import React from 'react'

export const GallerySkeleton = ({ mobileViewMode = 'grid' }) => {
  const aspects = [
    'aspect-[3/4]',
    'aspect-square',
    'aspect-[4/3]',
    'aspect-[3/4]',
    'aspect-[4/3]',
    'aspect-square'
  ]

  return (
    <>
      {/* Mobile Skeleton */}
      <div className="block sm:hidden">
        {mobileViewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#121216] border border-white/10 skeleton-shimmer"
              >
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 space-y-1.5">
                  <div className="h-2 w-14 rounded bg-white/10" />
                  <div className="h-3 w-24 rounded bg-white/15" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#121216] border border-white/10 skeleton-shimmer"
              >
                <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
                  <div className="h-5 w-24 rounded-full bg-white/10" />
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                </div>
                <div className="absolute bottom-4 inset-x-4 space-y-2">
                  <div className="h-4 w-44 rounded bg-white/15" />
                  <div className="h-2.5 w-32 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop & Tablet Masonry Skeleton */}
      <div className="hidden sm:block columns-2 lg:columns-3 gap-6 sm:gap-8 w-full max-w-6xl mx-auto">
        {aspects.map((aspect, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#121216] skeleton-shimmer break-inside-avoid mb-6 sm:mb-8 ${aspect}`}
          >
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10" />
            <div className="absolute inset-x-0 bottom-0 p-8 space-y-2">
              <div className="h-2.5 w-24 rounded bg-white/10" />
              <div className="h-5 w-44 rounded bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const TrainersSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
    {Array.from({ length: 3 }).map((_, idx) => (
      <div
        key={idx}
        className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#121216] skeleton-shimmer max-w-sm mx-auto w-full md:max-w-none"
      >
        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10" />
        <div className="absolute inset-x-0 bottom-0 p-8 space-y-3">
          <div className="h-5 w-20 rounded-full bg-white/10" />
          <div className="h-6 w-40 rounded bg-white/15" />
          <div className="h-3 w-32 rounded bg-white/10" />
        </div>
      </div>
    ))}
  </div>
)

export const TransformationsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
    {/* Left Before/After Slider Skeleton */}
    <div className="lg:col-span-5 w-full md:max-w-md lg:max-w-none mx-auto">
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-[#121216] skeleton-shimmer">
        <div className="absolute top-6 left-6 h-6 w-16 rounded-full bg-white/10" />
        <div className="absolute top-6 right-6 h-6 w-16 rounded-full bg-white/10" />
        <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1a20] border border-white/15" />
      </div>
    </div>

    {/* Right Copy & Stats Skeleton */}
    <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
      <div className="h-3 w-48 rounded bg-white/10 skeleton-shimmer" />
      <div className="h-9 w-64 rounded bg-white/15 skeleton-shimmer" />
      <div className="h-5 w-72 rounded bg-white/10 skeleton-shimmer" />
      <div className="space-y-2 pl-6 border-l border-white/10 py-1">
        <div className="h-3.5 w-full rounded bg-white/10 skeleton-shimmer" />
        <div className="h-3.5 w-5/6 rounded bg-white/10 skeleton-shimmer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 sm:p-6 rounded-2xl bg-dark-surface/50 border border-white/5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-7 w-20 rounded bg-white/15 skeleton-shimmer" />
            <div className="h-2.5 w-24 rounded bg-white/10 skeleton-shimmer" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2.5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="w-2.5 h-2.5 rounded-full bg-white/15 skeleton-shimmer" />
          ))}
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 skeleton-shimmer" />
          <div className="w-12 h-12 rounded-full bg-white/10 skeleton-shimmer" />
        </div>
      </div>
    </div>
  </div>
)
