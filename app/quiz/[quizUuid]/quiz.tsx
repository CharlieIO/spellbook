"use client";

import React, { useState } from 'react';
import Question from './question';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type QuizProps = {
  quizData: {
    title: string;
    questions: {
      question: string;
      answers: string[];
      correctAnswerIndex: number;
    }[];
  };
  onComplete: (score: number, wrongQuestionIndices: number[]) => void;
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
  };

  const handleQuizComplete = () => {
    const newAnswerStatus = [...answerStatus];
    let correctCount = 0;
    const wrongQuestionIndices: number[] = [];
    quizData.questions.forEach((question, index) => {
      if (question.correctAnswerIndex === userAnswers[index]) {
        correctCount++;
        newAnswerStatus[index] = true; // true for correct
      } else {
        newAnswerStatus[index] = false; // false for incorrect
        wrongQuestionIndices.push(index);
      }
    });
    setAnswerStatus(newAnswerStatus);
    const score = (correctCount / quizData.questions.length) * 100;
    onComplete(score, wrongQuestionIndices);
    setQuizCompleted(true);
  };

  const answeredQuestionsCount = userAnswers.filter(answer => answer !== -1).length;
  const totalQuestionsCount = quizData.questions.length;
  const progressValue = (answeredQuestionsCount / totalQuestionsCount) * 100;

  return (
    <div className="text-left flex flex-col space-y-6 mb-12">
      <h1 className="text-4xl font-bold mb-4 text-center">{quizData.title}</h1>
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
      {!quizCompleted && (
        <div className="pt-4">
          <Progress value={progressValue} />
          <p className="text-center mt-2">{answeredQuestionsCount} / {totalQuestionsCount} questions answered</p>
        </div>
      )}
      <div className="flex justify-center pt-6 pb-4 space-x-4">
        {!quizCompleted && <Button className="px-4 py-2" onClick={handleQuizComplete}>Complete Quiz</Button>}
        {quizCompleted && <Button className="px-4 py-2" onClick={onBack}>Back to Quiz Selection</Button>}
      </div>
    </div>
  );
};

export default Quiz;