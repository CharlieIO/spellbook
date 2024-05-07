import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface NoteCardSkeletonProps {
  index: number;
}

const NoteCardSkeleton: React.FC<NoteCardSkeletonProps> = ({ index }) => {
  // Define an array of skeleton widths
  const skeletonWidths = [
    "w-3/4", "w-2/3", "w-5/6", "w-1/2", "w-4/5", "w-2/4", "w-3/5", "w-1/3", "w-full", "w-3/4"
  ];

  // Randomize the order of skeleton widths
  const randomizedSkeletonWidths = skeletonWidths.sort(() => 0.5 - Math.random());

  return (
    <div key={index} className="animate-pulse flex flex-col items-center justify-center h-52 bg-gray-200 rounded-lg shadow max-w-sm w-full">
      <div className="w-full h-full bg-gray-300 rounded-lg p-4 space-y-2">
        {randomizedSkeletonWidths.map((width, idx) => (
          <Skeleton key={idx} className={`h-2 ${width}`} />
        ))}
      </div>
    </div>
  );
};

export default NoteCardSkeleton;
