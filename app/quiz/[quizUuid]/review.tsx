import React, { useEffect, useState, useCallback } from 'react';
import { NextPage } from 'next';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loadingspinner";

interface ReviewProps {
  score: number;
  quizUuid: string;
  wrongQuestionIndices: number[];
}

interface Topic {
  topic: string;
  importance: string;
}

const Review: NextPage<ReviewProps> = ({ score, quizUuid, wrongQuestionIndices }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to fetch review topics
  const fetchReviewTopics = useCallback(async () => {
    try {
      const response = await fetch(`/api/quizzes/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizUuid, wrongQuestionIndices }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch review topics');
      }

      const data = await response.json();
      setTopics(data.topics);
    } catch (error) {
      console.error('Error fetching review topics:', error);
      setError('Failed to fetch review topics. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [quizUuid, wrongQuestionIndices]);

  // Effect to fetch review topics when component mounts or dependencies change
  useEffect(() => {
    if (quizUuid && wrongQuestionIndices && wrongQuestionIndices.length > 0) {
      fetchReviewTopics();
    } else if (wrongQuestionIndices.length === 0) {
      setLoading(false);
    } else {
      setError('Quiz UUID and wrong question indices are required');
      setLoading(false);
    }
  }, [quizUuid, wrongQuestionIndices, fetchReviewTopics]);

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Quiz Review</CardTitle>
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-primary" />
          <div className="text-2xl font-bold">{score}%</div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {wrongQuestionIndices.length === 0 ? (
          <div>
            <h3 className="text-lg font-semibold">Congratulations!</h3>
            <p className="text-body">
              You got all the questions correct. No areas for improvement!
            </p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold">Areas for Improvement</h3>
              <p className="text-body">
                Here are some topics you can focus on to boost your performance:
              </p>
            </div>
            <div className="grid gap-2">
              {loading ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner className="h-12 w-12 text-primary" />
                </div>
              ) : error ? (
                <p className="text-error">{error}</p>
              ) : (
                topics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ArrowRightIcon className="w-4 h-4 mt-1 text-primary" />
                    <div>
                      <h4 className="font-semibold">{topic.topic}</h4>
                      <p className="text-body">
                        {topic.importance}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export default Review;
