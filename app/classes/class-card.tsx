import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

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
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 rounded bg-gray-400 dark:bg-gray-600"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-1/2 rounded bg-gray-400 dark:bg-gray-600"></div>
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
            <CardDescription>
              {classItem.description || "No description available."}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    );
  };

