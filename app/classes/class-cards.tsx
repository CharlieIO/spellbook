"use client"
import { useEffect, useState } from 'react'
import { CustomPagination } from "../components/pagination"
import { ClassCard } from "./class-card";
import { AddClassCard } from "./add-class-card"; // Assuming you have a component for adding new class cards

type ClassItem = {
  uuid: string;
  name: string;
  description?: string;
};

export function ClassCards() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const cardsPerRow = 4; // Number of cards per row
  const rowsPerPage = 2; // Number of full rows per page
  const cardsPerPage = cardsPerRow * rowsPerPage; // Total number of cards per page

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  const fetchClasses = async () => {
    setIsLoading(true); // Set loading to true when fetch starts
    try {
      const response = await fetch(`/api/classes?page=${currentPage}&limit=${cardsPerPage}`);
      const { data, total } = await response.json();
      setClasses(data);
      setTotalPages(Math.ceil(total / cardsPerPage));
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    } finally {
      setIsLoading(false); // Set loading to false when fetch completes
    }
  };

  const handleAddClass = async (name: string) => {
    console.log(`Adding class: ${name}`);
    // Assuming an API endpoint exists to add a class
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        if (currentPage === totalPages) {
          await fetchClasses(); // Refresh classes only if on the last page
        }
      } else {
        throw new Error('Failed to add class');
      }
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };

  return (
    <>
      <section className="w-full py-4 md:py-8 lg:py-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6">
          {classes.length === 0 && isLoading ? (
            Array.from({ length: cardsPerPage }, (_, index) => <ClassCard key={index} isLoading={true} />)
          ) : (
            classes.map(classItem => (
              <ClassCard key={classItem.uuid} classItem={classItem} />
            ))
          )}
        </div>
      </section>
      <div className="container mx-auto px-4 md:px-6">
        <div style={{ minHeight: '40px' }}> {/* Fixed minimum height to prevent layout shift */}
          {totalPages > 1 && (
            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
      <div className="container mx-auto mt-10 px-4 md:px-6">
        <AddClassCard onSubmit={handleAddClass} />
      </div>
    </>
  );
}
