'use client';
import { AddClassCard } from '@/classes/add-class-card';
import { useState } from 'react';

export default function AddClassForm() {
  const [name, setName] = useState('');

  const handleSubmit = async (className: string) => {
    const response = await fetch('/api/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: className }),
    });

    if (response.ok) {
      setName('');
      alert('Class added successfully');
    } else {
      const error = await response.json();
      alert(`Failed to add class: ${error.error}`);
    }
  };

  return (
    <AddClassCard onSubmit={handleSubmit} />
  );
}