import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ClassItem {
  uuid: string;
  name: string;
  created_at: string;
}

export function QuizSelectionCard() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');
  const [selectedClassUuid, setSelectedClassUuid] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();

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
      setIsButtonDisabled(true);
      try {
        const response = await fetch('/api/quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ classUuid: selectedClassUuid, numQuestions: numberOfQuestions })
        });
        if (!response.ok) {
          throw new Error('Failed to enqueue quiz generation job');
        }
        const { jobUuid } = await response.json();
        router.push(`/quiz/loading/${jobUuid}`);
      } catch (error) {
        console.error('Error generating quiz:', error);
        setIsButtonDisabled(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generate Quiz</CardTitle>
        <CardDescription>Select a class and number of questions to generate a quiz.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select onValueChange={setSelectedClassUuid} disabled={isLoading || isButtonDisabled}>
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
          <Select onValueChange={(value: string) => setNumberOfQuestions(value)} disabled={isLoading || isButtonDisabled}>
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
        <Button className="w-full" onClick={handleQuizGeneration} disabled={isLoading || isButtonDisabled}>
          Generate Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
