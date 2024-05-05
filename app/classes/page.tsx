import React from 'react';
import NavBar from '@/components/NavBar'; // Corrected the casing to match the actual file name consistently across the project
import { ClassCards } from '@/classes/class-cards';

export default function Classes() {
  return (
    <div>
      <NavBar />
      <ClassCards />
    </div>
  );
}

