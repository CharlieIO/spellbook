'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DescriptionProps {
  uuid: string;
}

const Description: React.FC<DescriptionProps> = ({ uuid }) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`/api/class/description`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId: uuid }), 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          console.error('Error fetching class description:', data.error);
        } else {
          setDescription(data.description);
        }
      } catch (e) {
        console.error('Error fetching class description:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [uuid]);

  if (loading) {
    return <Skeleton className="h-6 w-96 mx-auto" />;
  }

  return (
      <p>{description}</p>
  );
};

export default Description;

