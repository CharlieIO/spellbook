'use client'
import { useState, useEffect } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loadingspinner";

async function fetchQuiz(classUuid: string, numQuestions: string) {
  try {
    const response = await fetch('/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ classUuid, numQuestions })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const quiz = await response.json();
    return quiz;
  } catch (error) {
    console.error('Failed to fetch quiz:', error);
    return null;
  }
}

type ClassItem = {
  uuid: string;
  name: string;
  created_at: string;
};

type QuizSelectionCardProps = {
  onQuizGenerated: (quizData: any) => void;
};

export function QuizSelectionCard({ onQuizGenerated }: QuizSelectionCardProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');
  const [selectedClassUuid, setSelectedClassUuid] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClasses() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const jsonResponse = await response.json();
        if (jsonResponse.data && Array.isArray(jsonResponse.data)) {
          const sortedClasses = jsonResponse.data
            .map((item: { uuid: string; name: string; created_at: string }) => ({
              uuid: item.uuid,
              name: item.name,
              created_at: item.created_at
            }))
            .sort((a: ClassItem, b: ClassItem) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          setClasses(sortedClasses);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClasses();
  }, []);

  const handleQuizGeneration = async () => {
    if (selectedClassUuid && numberOfQuestions) {
      setIsGeneratingQuiz(true);
      const quizData = await fetchQuiz(selectedClassUuid, numberOfQuestions);
      console.log(quizData);
      onQuizGenerated(quizData.quiz);
    }
  };

  if (isGeneratingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center">
        <LoadingSpinner className="h-10 w-10 mb-4" />
        <p className="text-lg">Generating quiz... This can take some time, please do not refresh the page.</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generate Quiz</CardTitle>
        <CardDescription>Select a class and number of questions to generate a quiz.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select onValueChange={setSelectedClassUuid} disabled={classes.length === 0}>
            <SelectTrigger id="class" aria-label="Class">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classItem: ClassItem, index: number) => (
                <SelectItem key={index} value={classItem.uuid}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="number-of-questions">Number of Questions</Label>
          <Select onValueChange={(value) => setNumberOfQuestions(value)}>
            <SelectTrigger id="number-of-questions" aria-label="Number of Questions">
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              {['5', '10', '20', '50'].map((number, index) => (
                <SelectItem key={index} value={number}>
                  {number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={handleQuizGeneration}>Generate Quiz</Button>
      </CardContent>
    </Card>
  );
}
