import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { provideBlobStorageService, provideQueueService, provideDatastoreService } from '@/services/InstanceProvider';
import { IBlobStorageService } from '@/interfaces/IBlobStorageService';
import { IQueueService } from '@/interfaces/IQueueService';
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const queueService: IQueueService = provideQueueService();
  const datastoreService: IDatastoreAccessService = provideDatastoreService();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { classUuid, numQuestions, topics } = body;

  if (!classUuid) {
    return NextResponse.json({ error: 'Class UUID is required' }, { status: 400 });
  }

  if (!numQuestions) {
    return NextResponse.json({ error: 'Number of questions is required' }, { status: 400 });
  }

  const notesKeysResult = await datastoreService.fetchNoteKeysForClass(classUuid);
  if (!notesKeysResult) {
    console.error('Error fetching note keys');
    return NextResponse.json({ error: 'Failed to fetch note keys' }, { status: 500 });
  }
  const notesKeys = notesKeysResult['keys'];

  const quizJobUuid = uuidv4();

  try {
    await queueService.enqueue({
      jobUuid: quizJobUuid,
      noteKeys: notesKeys,
      numQuestions: numQuestions,
      topics: topics,
    });

    // Write the quiz UUID and class UUID to the database
    await datastoreService.saveQuizRecord({
      quizUuid: quizJobUuid,
      classUuid: classUuid,
      userId: userId
    });

    return NextResponse.json({ jobUuid: quizJobUuid });
  } catch (error) {
    console.error('Error enqueuing quiz generation job:', error);
    return NextResponse.json({ error: 'Failed to enqueue quiz generation job' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const quizUuid = searchParams.get('quizUuid');

  console.log(`Received GET request for quizUuid: ${quizUuid}`);

  if (!quizUuid) {
    console.log('Quiz UUID is missing in the request');
    return NextResponse.json({ error: 'Quiz UUID is required' }, { status: 400 });
  }

  const blobStorageService: IBlobStorageService = provideBlobStorageService();
  const datastoreService: IDatastoreAccessService = provideDatastoreService();

  const quizResult = await blobStorageService.getGeneratedQuiz(quizUuid);

  if (quizResult === null || quizResult === undefined) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  let parsedQuizResult;
  try {
    parsedQuizResult = JSON.parse(quizResult);
  } catch (error) {
    console.error('Error parsing quiz result:', error);
    return NextResponse.json({ error: 'Invalid quiz data' }, { status: 500 });
  }

  const { className, error } = await datastoreService.fetchClassNameFromQuizUuid(quizUuid);

  if (error) {
    console.error('Error fetching class name from quiz UUID:', error);
    return NextResponse.json({ error: 'Failed to fetch class name' }, { status: 500 });
  }

  if (!className) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }

  const quizTitle = `${className} Quiz`;

  console.log(`Successfully fetched quiz data for quizUuid: ${quizUuid}`);
  return NextResponse.json({ quiz: parsedQuizResult, title: quizTitle });
}
