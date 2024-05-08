import React from 'react';
import { ModeToggle } from '@/components/darkmodeToggle';
import { ClerkLoading, ClerkLoaded, UserButton } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';

const UserButtonComponent = () => {
  return (
    <div className="flex items-center gap-4">
      <ModeToggle />
      <div className="relative w-8 h-8">
        <ClerkLoading>
          <Skeleton className="absolute inset-0 rounded-full" />
        </ClerkLoading>
        <ClerkLoaded>
          <div className="absolute inset-0 flex items-center justify-center">
            <UserButton />
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default UserButtonComponent;
