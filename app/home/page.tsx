import React from 'react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="container mx-auto">
        <div className="text-center py-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to spellbook</h1>
          <p className="text-xl mb-6">Turn your notes into study guides and quizzes with magic (math).</p>
          <div className="flex justify-center mt-10">
            <Button>
              <Link href="/classes">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
