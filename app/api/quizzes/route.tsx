import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from 'lib/groqClient';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { provideDatastoreService } from '@/services/InstanceProvider';
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';

export async function POST(request: NextRequest) {
  const datastoreService: IDatastoreAccessService = provideDatastoreService();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const classUuid = body.classUuid;

  if (!classUuid) {
    return NextResponse.json({ error: 'Class UUID is required' }, { status: 400 });
  }

  const { data: classData, error: classError } = await datastoreService.fetchClass(userId, classUuid);

  if (classError || !classData) {
    console.error('Error fetching class:', classError);
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }

  const blobStorageService = provideBlobStorageService();
  const fileKey = `notes/${classUuid}.json`;

  try {
    const notesText = await blobStorageService.getSignedUrlForDisplay(fileKey);
    const notes = JSON.parse(notesText);

    const groqClient = getGroqClient("Generate quiz from class notes");
    const quiz = await generateQuizFromNotes(groqClient, notes);

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error accessing blob storage:', error);
    return NextResponse.json({ error: 'Failed to fetch notes from blob storage' }, { status: 500 });
  }
}

async function generateQuizFromNotes(groqClient: any, notes: any[]) {
  const groqQuery = "Generate a quiz based on these notes";
  try {
    const response = await groqClient.query(groqQuery, { "response_format": {"type": "json_object"} });
    return response.data;
  } catch (error) {
    console.error('Error generating quiz with Groq:', error);
    throw new Error('Failed to generate quiz');
  }
}
