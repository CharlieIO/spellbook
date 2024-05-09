"use client";
import React from 'react';
import Options from '@/quizzes/options';

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
    <div className="space-y-4">
      <h3 className="text-lg">{index + 1}. {question.question}</h3>
      <Options
        options={question.answers}
        questionIndex={index}
        onOptionSelected={handleOptionSelected}
        answerStatus={answerStatus}
        correctAnswerIndex={question.correctAnswerIndex}
        selectedAnswerIndex={selectedAnswerIndex}
      />
    </div>
  );
};

export default Question;