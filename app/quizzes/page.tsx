'use client';
import { useState } from 'react';
import NavBar from "@/components/navbar";
import { QuizSelectionCard } from "@/quizzes/quiz-selection-card";
import Quiz from '@/quizzes/quiz';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type QuizData = {
  questions: {
    question: string;
    answers: string[];
    correctAnswerIndex: number;
  }[];
};

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null); // State to store the score
  const [reviewMode, setReviewMode] = useState(false); // State to control review mode

  const handleQuizGenerated = (data: QuizData) => {
    setQuizData(data);
    setShowQuiz(true);
    setScore(null); // Reset score when a new quiz is generated
    setReviewMode(false); // Exit review mode when starting a new quiz
  };

  const handleQuizComplete = (score: number) => {
    setScore(score); // Store the score
    setReviewMode(true); // Enter review mode
    console.log(`Quiz completed! Score: ${score}%`);
  };

  const handleBackToSelection = () => {
    setShowQuiz(false);
    setQuizData(null);
    setScore(null);
    setReviewMode(false);
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto text-center mt-10">
        {!showQuiz && (
          <div className="flex justify-center p-12">
            <QuizSelectionCard onQuizGenerated={handleQuizGenerated} />
          </div>
        )}
        {showQuiz && quizData && (
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