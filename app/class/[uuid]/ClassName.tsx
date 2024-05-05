'use client';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';

interface ClassNameProps {
  uuid: string;
}

const ClassName: React.FC<ClassNameProps> = ({ uuid }) => {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    async function fetchClassName() {
      console.log(`Attempting to fetch class name for UUID: ${uuid}`);
      try {
        const response = await fetch(`/api/class?uuid=${uuid}`);
        console.log('Received response from server:', response);
        if (!response.ok) {
          console.error('Response not OK, throwing error');
          throw new Error('Failed to fetch class name');
        }
        const data = await response.json();
        console.log('Data received from server:', data);
        if (data && data.data && data.data.name) {
          setName(data.data.name);
          console.log(`Class name set to state: ${data.data.name}`);
        } else {
          console.error('Class name not found in response data');
        }
      } catch (error) {
        console.error('Error fetching class name:', error);
      }
    }

    fetchClassName();
  }, [uuid]);

  return (
    <div className="font-bold text-3xl text-center my-8 py-2">
      {name ? name : <div className="flex justify-center"><Skeleton style={{ width: '300px', height: '38px' }} /></div>}
    </div>
  );
};

export default ClassName;
