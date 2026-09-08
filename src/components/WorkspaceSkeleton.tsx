import React from 'react';

type SkeletonVariant = 'student' | 'academician' | 'industry' | 'institution';

interface Props {
  variant: SkeletonVariant;
}

const SkeletonBlock: React.FC<{ className: string }> = ({ className }) => (
  <div className={`skeleton-block ${className}`} />
);

export const WorkspaceSkeleton: React.FC<Props> = ({ variant }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" role="status" aria-label="Loading workspace">
    <div className="glass-panel rounded-3xl p-6 sm:p-8">
      <SkeletonBlock className="h-4 w-48" />
      <SkeletonBlock className="mt-5 h-9 max-w-2xl" />
      <SkeletonBlock className="mt-3 h-4 max-w-xl" />
      <SkeletonBlock className="mt-2 h-4 max-w-lg" />
      <div className="mt-7 flex gap-3">
        <SkeletonBlock className="h-10 w-32" />
        <SkeletonBlock className="h-10 w-28" />
      </div>
    </div>

    {variant === 'institution' ? (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => <SkeletonBlock key={index} className="h-32 rounded-2xl" />)}
      </div>
    ) : (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex justify-between"><SkeletonBlock className="h-10 w-10" /><SkeletonBlock className="h-5 w-20" /></div>
              <SkeletonBlock className="h-5 w-4/5" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <SkeletonBlock className="h-64 rounded-3xl" />
          <SkeletonBlock className="h-64 rounded-3xl" />
        </div>
      </>
    )}
    <span className="sr-only">Loading {variant} workspace</span>
  </div>
);