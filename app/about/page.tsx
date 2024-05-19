import React from 'react';
import NavBar from '@/components/navbar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function About() {
  return (
    <div>
      <NavBar />
      <div className="container mx-auto mt-10 px-4 md:px-6">
        <Card className="w-full max-w-3xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle>About Spellbook</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Spellbook is an innovative app that leverages AI to transform your pictures of notes into quizzes and other study aids. 
              Simply upload your notes, and our AI will generate flashcards, study guides, quizzes, and more to help you study effectively.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}