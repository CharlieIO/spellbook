import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from 'lib/supabaseClient';
import { getGroqClient } from 'lib/groqClient';

async function fetchClassId(request: NextRequest): Promise<string> {
  const requestData = await request.json();
  return requestData.classId;
}

async function fetchExistingDescription(client: any, classId: string) {
  return await client
    .from('class_descriptions')
    .select('description')
    .match({ class_id: classId })
    .order('description', { ascending: true });
}

async function fetchClassName(client: any, classId: string) {
  return await client
    .from('classes')
    .select('name')
    .match({ uuid: classId })
    .single();
}

async function generateDescription(groqClient: any, className: string) {
  return await groqClient.query(`Generate a short description for a class named ${className}`);
}

async function saveNewDescription(client: any, classId: string, newDescription: string) {
  return await client
    .from('class_descriptions')
    .insert([
      { class_id: classId, description: newDescription }
    ]);
}

async function initializeGroqIfNeeded(className: string) {
  if (!className) return null;
  return getGroqClient(
    "Generate a class description based on the class name. " +
    "Only respond with the description, nothing else. " +
    "Everything you say will be shown. " +
    "Do not put your response in quotes. " +
    "Make sure to keep your response short and concise. " +
    "Use at most 10 words." +
    "Do not use the word 'class' in the description." +
    "If the class name seems like gibberish or is otherwise unrelated to a real class, return a funny description."
  );
}

export async function POST(request: NextRequest) {
  console.log('Received request for generating class description');
  const { userId } = auth();

  if (!userId) {    
    console.log('Unauthorized request: No user ID found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await createClerkSupabaseClient();
  const classId = await fetchClassId(request);
  console.log(`Received class ID: ${classId}`);

  if (!classId) {
    console.log('Bad request: Class ID is required');
    return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
  }

  // Check if description already exists
  const { data: existingData, error: existingError } = await fetchExistingDescription(client, classId);

  if (existingError) {
    console.error('Error fetching existing description:', existingError);
    return NextResponse.json({ error: 'Failed to fetch existing description' }, { status: 500 });
  }

  if (existingData && existingData.length > 0) {
    console.log('Description already exists, returning the first existing description');
    return NextResponse.json({ description: existingData[0].description });
  }

  // Fetch class name and generate description if not exists
  const { data: classData, error: classError } = await fetchClassName(client, classId);

  if (classError || !classData) {
    console.error('Error fetching class:', classError);
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  const className = classData.name;
  console.log(`Fetched class name: ${className}`);

  const groqClient = await initializeGroqIfNeeded(className);
  if (!groqClient) {
    console.error('Groq client is not initialized');
    return NextResponse.json({ error: 'Groq client is not available' }, { status: 500 });
  }
  const groqResponse = await generateDescription(groqClient, className);

  if (!groqResponse || (groqResponse as any).error) {
    console.error('Error generating description with Groq:', (groqResponse as any).error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
  const newDescription = groqResponse.choices[0].message.content;
  console.log(`Generated new description: ${newDescription}`);

  // Save the new description to the database
  const { error: saveError } = await saveNewDescription(client, classId, newDescription);

  if (saveError) {
    console.error('Error saving new description:', saveError);
    return NextResponse.json({ error: 'Failed to save description' }, { status: 500 });
  }

  console.log('Successfully saved new description');
  return NextResponse.json({ description: newDescription });
}
