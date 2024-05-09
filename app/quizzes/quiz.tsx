"use client";

import React, { useState } from 'react';
import Question from './question';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type QuizProps = {
  quizData: {
    questions: {
      question: string;
      answers: string[];
      correctAnswerIndex: number;
    }[];
  };
  onComplete: (score: number) => void;
  onBack: () => void; // Added a prop to handle restarting the quiz
};

const Quiz: React.FC<QuizProps> = ({ quizData, onComplete, onBack }) => {
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(quizData.questions.length).fill(-1));
  const [answerStatus, setAnswerStatus] = useState<(boolean | null)[]>(new Array(quizData.questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const handleAnswerSelected = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
    console.log(`Updated userAnswers: ${newAnswers}`);
  };

  const handleQuizComplete = () => {
    const newAnswerStatus = [...answerStatus];
    let correctCount = 0;
    quizData.questions.forEach((question, index) => {
      if (question.correctAnswerIndex === userAnswers[index]) {
        correctCount++;
        newAnswerStatus[index] = true; // true for correct
      } else {
        newAnswerStatus[index] = false; // false for incorrect
      }
    });
    setAnswerStatus(newAnswerStatus);
    const score = (correctCount / quizData.questions.length) * 100;
    console.log(`Quiz completed! Score: ${score}%`);
    onComplete(score);
    setQuizCompleted(true);
  };

  return (
    <Card className="text-left flex flex-col p-6 space-y-4 mb-8">
      {quizData.questions.map((question, index) => (
        <Question
          key={index}
          question={question}
          index={index}
          onAnswerSelected={handleAnswerSelected}
          answerStatus={answerStatus[index]}
          selectedAnswerIndex={userAnswers[index]} // Passed to Options component
        />
      ))}
      <CardFooter className="flex justify-center pt-4 pb-2 space-x-4">
        <Button className="px-4 py-2" onClick={handleQuizComplete}>Complete Quiz</Button>
        {quizCompleted && <Button className="px-4 py-2" onClick={onBack}>Back</Button>}
      </CardFooter>
    </Card>
  );
};

export default Quiz;