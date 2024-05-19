'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from "@/components/navbar";
import Quiz from '@/quiz/[quizUuid]/quiz';
import Review from '@/quiz/[quizUuid]/review';

type QuizData = {
  title: string;
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
  const [wrongQuestionIndices, setWrongQuestionIndices] = useState<number[]>([]);

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
          setQuizData({
            ...data.quiz,
            title: data.title
          });
        })
        .catch(error => {
          console.error('Error fetching quiz data:', error);
        });
    }
  }, [quizUuid]);

  const handleQuizComplete = (score: number, wrongQuestionIndices: number[]) => {
    setScore(score);
    setWrongQuestionIndices(wrongQuestionIndices);
    setReviewMode(true);
    console.log(`Quiz completed! Score: ${score}%`);
  };

  const handleBackToSelection = () => {
    router.push('/quizzes');
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto mt-10">
        <>
          {quizData && (
            <div className="mt-8">
              <Quiz 
                quizData={quizData} 
                onComplete={(score: number, wrongQuestionIndices: number[]) => handleQuizComplete(score, wrongQuestionIndices)} 
                onBack={handleBackToSelection} 
              />
            </div>
          )}
          {reviewMode && score !== null && (
            <div className="mt-8 pb-8">
              <Review score={score} quizUuid={quizUuid} wrongQuestionIndices={wrongQuestionIndices} />
            </div>
          )}
        </>
      </div>
    </>
  );
}
