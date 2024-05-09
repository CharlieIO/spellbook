import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { provideDatastoreService } from '@/services/InstanceProvider';
import { provideLargeLlmService } from '@/services/InstanceProvider'; // Import the LLM service provider
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';
import { ILlmService } from '@/interfaces/ILlmService'; // Import the LLM service interface

export async function POST(request: NextRequest) {
  const datastoreService: IDatastoreAccessService = provideDatastoreService();
  const llmService: ILlmService = provideLargeLlmService(); // Get the LLM service instance
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const classUuid = body.classUuid;
  const numQuestions = body.numQuestions || 5; // Default to 5 questions if not specified

  if (!classUuid) {
    return NextResponse.json({ error: 'Class UUID is required' }, { status: 400 });
  }

  const { data: classData, error: classError } = await datastoreService.fetchClass(userId, classUuid);

  if (classError || !classData) {
    console.error('Error fetching class:', classError);
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }

  const blobStorageService = provideBlobStorageService();
  const notesKeysResult = await datastoreService.fetchNoteKeysForClass(classUuid);
  if (notesKeysResult.error) {
    console.error('Error fetching note keys:', notesKeysResult.error);
    return NextResponse.json({ error: 'Failed to fetch note keys' }, { status: 500 });
  }
  const notesKeys = notesKeysResult.keys;
  const notesPromises = notesKeys.map((key: string) => blobStorageService.getTextFromFile(key));
  const notesTexts = await Promise.all(notesPromises);
  console.log(notesTexts);

  try {
    const quiz = await generateQuizFromNotes(llmService, notesTexts, numQuestions);
    console.log(quiz);
    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error accessing blob storage:', error);
    return NextResponse.json({ error: 'Failed to fetch notes from blob storage' }, { status: 500 });
  }
}

async function generateQuizFromNotes(llmService: ILlmService, notes: any[], numQuestions: number) {
  if (!notes || notes.length === 0) {
    throw new Error('Notes are required to generate a quiz');
  }

  try {
    const quizJson = await llmService.generateQuizJsonFromNotes(notes, numQuestions);
    return JSON.parse(quizJson);
  } catch (error) {
    console.error('Error generating quiz with LLM:', error);
    throw new Error('Failed to generate quiz');
  }
}
