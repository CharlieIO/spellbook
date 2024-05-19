import { NextRequest, NextResponse } from 'next/server';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { IBlobStorageService } from '@/interfaces/IBlobStorageService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobUuid = searchParams.get('jobUuid');

  if (!jobUuid) {
    return NextResponse.json({ error: 'Job UUID is required' }, { status: 400 });
  }

  const blobStorageService: IBlobStorageService = provideBlobStorageService();

  try {
    const quizData = await blobStorageService.getGeneratedQuiz(jobUuid);

    if (quizData) {
      return NextResponse.json({ quiz: JSON.parse(quizData) });
    } else {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'NoSuchKey') {
      console.error(`Failed to retrieve generated quiz from file with key ${jobUuid} from bucket spellbook-generated-quizzes:`, error);
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    } else {
      console.error('Error fetching quiz:', error);
      return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
    }
  }
}


