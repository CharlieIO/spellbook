import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { provideDatastoreService } from '@/services/InstanceProvider';
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';

export async function POST(request: NextRequest) {
  console.log('POST request received');
  const datastoreService: IDatastoreAccessService = provideDatastoreService();
  const { userId } = auth();

  if (!userId) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { quizUuid, score } = body;

  console.log('Request body:', body);

  if (!quizUuid) {
    console.log('Quiz UUID is missing');
    return NextResponse.json({ error: 'Quiz UUID is required' }, { status: 400 });
  }

  if (score === undefined || score === null) {
    console.log('Score is missing');
    return NextResponse.json({ error: 'Score is required' }, { status: 400 });
  }

  try {
    await datastoreService.saveQuizScore({
      quizUuid: quizUuid,
      score: score
    });

    console.log('Score recorded successfully for quizUuid:', quizUuid);
    return NextResponse.json({ message: 'Score recorded successfully' });
  } catch (error) {
    console.error('Error saving quiz score:', error);
    return NextResponse.json({ error: 'Failed to save quiz score' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log('GET request received');
  const datastoreService: IDatastoreAccessService = provideDatastoreService();
  const { userId } = auth();

  if (!userId) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classUuid = searchParams.get('classUuid');

  console.log('Request URL:', request.url);

  if (!classUuid) {
    console.log('Class UUID is missing');
    return NextResponse.json({ error: 'Class UUID is required' }, { status: 400 });
  }

  try {
    const scoresResponse = await datastoreService.fetchAllQuizScoresForClass(classUuid);

    if (scoresResponse.error) {
      console.error('Error fetching scores for class:', scoresResponse.error);
      return NextResponse.json({ error: 'Failed to fetch scores for class' }, { status: 500 });
    }

    console.log('Scores fetched successfully for classUuid:', classUuid);
    console.log('Fetched scores:', scoresResponse.scores);
    return NextResponse.json({ scores: scoresResponse.scores });
  } catch (error) {
    console.error('Error fetching scores for class:', error);
    return NextResponse.json({ error: 'Failed to fetch scores for class' }, { status: 500 });
  }
}
