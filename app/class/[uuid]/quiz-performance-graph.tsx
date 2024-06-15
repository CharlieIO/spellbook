'use client'
import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Score {
  quizUuid: string;
  score: number;
  createdAt: string; // timestamp
}

interface FormattedData {
  id: string;
  data: { x: string; y: number }[];
}

interface QuizPerformanceGraphProps {
  uuid: string;
}

const QuizPerformanceGraph: React.FC<QuizPerformanceGraphProps> = ({ uuid }) => {
  const [data, setData] = useState<FormattedData[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`/api/quizzes/score?classUuid=${uuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch quiz scores');
        }
        const result = await response.json();
        console.log('API response:', result); // Log the entire response for debugging
        const scores: Score[] = result.scores;
        if (!Array.isArray(scores)) {
          throw new Error('Scores data is not an array');
        }
        const formattedData: FormattedData[] = [
          {
            id: "Scores",
            data: scores
              .filter(score => score.createdAt && score.score !== undefined)
              .map((score) => ({
                x: new Date(score.createdAt).toLocaleString(),
                y: score.score,
              })),
          },
        ];
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching quiz scores:', error);
      }
    };

    fetchScores();
  }, [uuid]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="mt-8 p-6 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Quiz Performance Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-[4/3]">
            <ResponsiveLine
              data={data}
              margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{ tickSize: 0, tickPadding: 16 }}
              axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
              colors={["hsl(var(--primary))", "hsl(var(--destructive))"]}
              pointSize={6}
              useMesh={true}
              gridYValues={6}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: 'hsl(var(--foreground))',
                    },
                  },
                  legend: {
                    text: {
                      fill: 'hsl(var(--foreground))',
                    },
                  },
                },
                tooltip: {
                  chip: { borderRadius: '9999px' },
                  container: { fontSize: '12px', textTransform: 'capitalize', borderRadius: '6px' },
                  basic: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  },
                },
                grid: { line: { stroke: 'hsl(var(--border))' } },
              }}
              role="application"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPerformanceGraph;
