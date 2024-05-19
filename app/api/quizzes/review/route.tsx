import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ILlmService } from '@/interfaces/ILlmService';
import { provideSmallLlmService } from '@/services/InstanceProvider';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { IBlobStorageService } from '@/interfaces/IBlobStorageService';

interface ReviewRequestBody {
  quizUuid: string;
  wrongQuestionIndices: number[];
}

async function fetchRequestBody(request: NextRequest): Promise<ReviewRequestBody> {
  return await request.json();
}

async function generateReviewTopicsWithRetry(llmService: ILlmService, wrongQuestions: { question: string; answerChoices: string[]; correctAnswer: string }[], retries: number = 3): Promise<string[]> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await llmService.generateReviewTopics(wrongQuestions);
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt >= retries) {
        throw new Error('Failed to generate review topics after multiple attempts');
      }
    }
  }
  throw new Error('Failed to generate review topics');
}

export async function POST(request: NextRequest) {
  console.log('Received request for generating review topics');
  const { userId } = auth();

  if (!userId) {
    console.log('Unauthorized request: No user ID found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const llmService: ILlmService = provideSmallLlmService();
  const blobStorageService: IBlobStorageService = provideBlobStorageService();
  const { quizUuid, wrongQuestionIndices } = await fetchRequestBody(request);
  console.log(`Received quiz UUID: ${quizUuid} and wrong question indices: ${JSON.stringify(wrongQuestionIndices)}`);

  if (!quizUuid || !wrongQuestionIndices || wrongQuestionIndices.length === 0) {
    console.log('Bad request: Quiz UUID and wrong question indices are required');
    return NextResponse.json({ error: 'Quiz UUID and wrong question indices are required' }, { status: 400 });
  }

  try {
    const quizContent = await blobStorageService.getGeneratedQuiz(quizUuid);
    if (!quizContent) {
      console.log('Quiz not found');
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const quiz = JSON.parse(quizContent);
    const wrongQuestions = wrongQuestionIndices.map(index => quiz.questions[index]);
    console.log(`Fetched wrong questions: ${JSON.stringify(wrongQuestions)}`);

    const reviewTopics = await generateReviewTopicsWithRetry(llmService, wrongQuestions.map(q => ({
      question: q.question,
      answerChoices: q.answers,
      correctAnswer: q.answers[q.correctAnswerIndex]
    })));
    console.log(`Generated review topics: ${JSON.stringify(reviewTopics)}`);

    return NextResponse.json({ topics: reviewTopics });
  } catch (error) {
    console.error('Error generating review topics:', error);
    return NextResponse.json({ error: 'Failed to generate review topics' }, { status: 500 });
  }
}
