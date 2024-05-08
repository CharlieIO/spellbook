import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ClassItem = {
  uuid: string;
  name: string;
  description?: string;
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
      <Card className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
        <CardHeader>
          <CardTitle>{classItem.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-[3rem]">{classItem.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
