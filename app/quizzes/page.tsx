'use client';
import { useState } from 'react';
import NavBar from "@/components/navbar";
import { QuizSelectionCard } from "@/quizzes/quiz-selection-card";

export default function QuizPage() {
  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto text-center mt-10">
        <div className="flex justify-center p-12">
          <QuizSelectionCard />
        </div>
      </div>
    </>
  );
}
