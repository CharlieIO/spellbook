import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { JSX, SVGProps } from "react";

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

export default function ClassCard({ classItem, isLoading = false }: ClassCardProps) {
  return (
    <Link href={`/class/${classItem?.uuid}`}>
      <Card className="w-full shadow-md transition-colors hover:bg-accent">
        <CardHeader>
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : (
            <CardTitle>{classItem?.name}</CardTitle>
          )}
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-5 w-12" />
                </>
              ) : (
                <>
                  <FileIcon className="w-5 h-5" />
                  <span>Notes</span>
                </>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-6" />
            ) : (
              <span className="font-medium">{classItem?.notesCount}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-5 w-12" />
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  <span>Quizzes</span>
                </>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-6" />
            ) : (
              <span className="font-medium">{classItem?.totalQuizScores}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-5 w-24" />
                </>
              ) : (
                <>
                  <BarChartIcon className="w-5 h-5" />
                  <span>Average Score</span>
                </>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-6" />
            ) : (
              <span className="font-medium">{classItem?.averageQuizScore}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BarChartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}