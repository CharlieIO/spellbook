import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ClassItem = {
  uuid: string;
  name: string;
  notesCount: number;
  totalQuizScores: number;
  averageQuizScore: number;
};

type ClassCardProps = {
    classItem?: ClassItem;
    isLoading?: boolean;
  };
  
export const ClassCard: React.FC<ClassCardProps> = ({ classItem, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="transition-colors">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" /> {/* Adjusted to simulate two lines of description */}
        </CardContent>
      </Card>
    );
  }

  if (!classItem) {
    return null;
  }

  return (
    <Link href={`/class/${classItem.uuid}`}>
      <Card className="w-full shadow-md transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{classItem.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: 'Courier New, monospace', fontStyle: 'italic' }}>Notes uploaded: {classItem.notesCount}</p>
          <p style={{ fontFamily: 'Courier New, monospace', fontStyle: 'italic' }}>Quizzes taken: {classItem.totalQuizScores}</p>
          <p style={{ fontFamily: 'Courier New, monospace', fontStyle: 'italic' }}>Average quiz score: {classItem.averageQuizScore}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
