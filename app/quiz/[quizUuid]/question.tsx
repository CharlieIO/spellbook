"use client";
import React from 'react';
import Options from '@/quiz/[quizUuid]/options';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type QuestionProps = {
  question: {
    question: string;
    answers: string[];
    correctAnswerIndex: number;
  };
  index: number;
  onAnswerSelected: (questionIndex: number, answerIndex: number) => void;
  answerStatus: boolean | null;
  selectedAnswerIndex: number | null; // Added to pass down the selected answer index
};

const Question: React.FC<QuestionProps> = ({ question, index, onAnswerSelected, answerStatus, selectedAnswerIndex }) => {
  const handleOptionSelected = (answerIndex: number) => {
    onAnswerSelected(index, answerIndex);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">{index + 1}. {question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Options
          options={question.answers}
          questionIndex={index}
          onOptionSelected={handleOptionSelected}
          answerStatus={answerStatus}
          correctAnswerIndex={question.correctAnswerIndex}
          selectedAnswerIndex={selectedAnswerIndex}
        />
      </CardContent>
    </Card>
  );
};

export default Question;
