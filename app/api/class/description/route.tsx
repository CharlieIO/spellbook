import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ILlmService } from '@/interfaces/ILlmService';
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';
import { provideDatastoreService, provideLlmService } from '@/services/InstanceProvider';

async function fetchClassId(request: NextRequest): Promise<string> {
  const requestData = await request.json();
  return requestData.classId;
}

export async function POST(request: NextRequest) {
  console.log('Received request for generating class description');
  const { userId } = auth();

  if (!userId) {    
    console.log('Unauthorized request: No user ID found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const datastoreService: IDatastoreAccessService = provideDatastoreService();
  const llmService: ILlmService = provideLlmService();
  const classId = await fetchClassId(request);
  console.log(`Received class ID: ${classId}`);

  if (!classId) {
    console.log('Bad request: Class ID is required');
    return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
  }

  // Check if description already exists
  const { descriptions: existingDescriptions, error: existingError } = await datastoreService.fetchDescriptions(classId);

  if (existingError) {
    console.error('Error fetching existing description:', existingError);
    return NextResponse.json({ error: 'Failed to fetch existing description' }, { status: 500 });
  }

  if (existingDescriptions && existingDescriptions.length > 0) {
    console.log('Description already exists, returning the first existing description');
    return NextResponse.json({ description: existingDescriptions[0] });
  }

  // Fetch class name and generate description if not exists
  const { className, error: classError } = await datastoreService.fetchClassName(classId);

  if (classError || !className) {
    console.error('Error fetching class:', classError);
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  console.log(`Fetched class name: ${className}`);

  try {
    const description = await llmService.generateDescriptionForClass(className);
    console.log(`Generated new description: ${description}`);

    // Save the new description to the database
    const { error: saveError } = await datastoreService.insertDescription(classId, description);

    if (saveError) {
      console.error('Error saving new description:', saveError);
      return NextResponse.json({ error: 'Failed to save description' }, { status: 500 });
    }

    console.log('Successfully saved new description');
    return NextResponse.json({ description: description });
  } catch (error) {
    console.error('Error generating or saving description:', error);
    return NextResponse.json({ error: 'Failed to generate or save description' }, { status: 500 });
  }
}
