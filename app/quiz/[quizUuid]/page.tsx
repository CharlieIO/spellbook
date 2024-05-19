'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from "@/components/navbar";
import Quiz from '@/quizzes/quiz';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type QuizData = {
  questions: {
    question: string;
    answers: string[];
    correctAnswerIndex: number;
  }[];
};

export default function QuizPage({ params }: { params: { quizUuid: string } }) {
  const router = useRouter();
  const quizUuid = params.quizUuid;
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

useEffect(() => {
  // Fetch the quiz data using the quizUuid
  if (quizUuid) {
    fetch(`/api/quizzes?quizUuid=${quizUuid}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setQuizData(data.quiz);
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
      });
  }
}, [quizUuid]);


  const handleQuizComplete = (score: number) => {
    setScore(score);
    setReviewMode(true);
    console.log(`Quiz completed! Score: ${score}%`);
  };

  const handleBackToSelection = () => {
    router.push('/quizzes');
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto text-center mt-10">
        {quizData && (
          <div className="mt-8">
            <Quiz quizData={quizData} onComplete={handleQuizComplete} onBack={handleBackToSelection} />
          </div>
        )}
        {reviewMode && score !== null && (
          <div className="text-center mt-4 mb-10">
            <Alert variant="default">
              <AlertTitle>{score >= 75 ? "Excellent Performance!" : score >= 50 ? "Good Effort!" : "Needs Improvement"}</AlertTitle>
              <AlertDescription>
                {score >= 75 ? `You scored ${score}%. Outstanding result!` :
                 score >= 50 ? `You scored ${score}%. A solid attempt, but there's room for improvement.` :
                 `You scored ${score}%. Consider reviewing the material and trying again.`}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </>
  );
}
