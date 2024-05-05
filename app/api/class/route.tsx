import { auth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from 'lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const client = await createClerkSupabaseClient();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const classUuid = url.searchParams.get('uuid');

  if (!classUuid) {
    return NextResponse.json({ error: 'Class UUID is required' }, { status: 400 });
  }

  const { data, error } = await client
    .from('classes')
    .select('*')
    .match({ uuid: classUuid, user_id: userId })
    .single();

  if (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }

  return NextResponse.json({ data });
}
