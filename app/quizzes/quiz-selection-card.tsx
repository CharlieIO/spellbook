import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ClassItem {
  uuid: string;
  name: string;
  created_at: string;
}

export function QuizSelectionCard() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');
  const [selectedClassUuid, setSelectedClassUuid] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
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
            .sort((a: ClassItem, b: ClassItem) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

  useEffect(() => {
    async function fetchTopics() {
      if (!selectedClassUuid) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/class/topics?classUuid=${selectedClassUuid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const jsonResponse = await response.json();
        if (jsonResponse.topics && Array.isArray(jsonResponse.topics)) {
          console.log('Fetched topics:', jsonResponse.topics); // Log the topics for testing
          setTopics(jsonResponse.topics);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopics();
  }, [selectedClassUuid]);
  
  const handleQuizGeneration = async () => {
    if (selectedClassUuid && numberOfQuestions) {
      setIsButtonDisabled(true);
      try {
        const response = await fetch('/api/quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ classUuid: selectedClassUuid, numQuestions: numberOfQuestions, topics: selectedTopics })
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

  const handleTopicChange = (values: string[]) => {
    setSelectedTopics(values);
  };

  return (
    <Card className="w-full shadow-md max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Practice Quiz</CardTitle>
        <CardDescription>
          Select a class, number of questions, and focus topics (optional) to generate a quiz. 
          Topic extraction is based on your notes, and may take a few minutes after file upload.
          Available topics will display after selecting a class.
        </CardDescription>
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
        {selectedClassUuid && topics.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="topics">Topics of Focus (optional)</Label>
            <p className="text-sm"><em>Your selections will act as suggestions for the AI model to use to generate questions. The questions may not reflect only the selected topics.</em></p>
            <ScrollArea className="h-64 border-2 rounded-lg">
              <ToggleGroup type="multiple" onValueChange={handleTopicChange} disabled={isLoading || isButtonDisabled} className="flex flex-col space-y-2">
                {topics.map((topicName: string, index: number) => (
                  <ToggleGroupItem key={index} value={topicName} className="rounded-lg">
                    <span className="font-normal">{topicName}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </ScrollArea>
          </div>
        )}
        <Button className="w-full" onClick={handleQuizGeneration} disabled={isLoading || isButtonDisabled}>
          Generate Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
