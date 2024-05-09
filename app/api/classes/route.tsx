import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from 'lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const client = await createClerkSupabaseClient();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();

  const { data, error } = await client
    .from('classes')
    .insert({ name, user_id: userId })
    .single();

  if (error) {
    console.error('Error inserting class:', error);
    return NextResponse.json({ error: 'Failed to add class' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function GET(request: NextRequest) {
  const client = await createClerkSupabaseClient();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const pageParam = url.searchParams.get('page');
  const limitParam = url.searchParams.get('limit');

  let query = client
    .from('classes')
    .select(`
      *,
      class_descriptions (description)
    `, { count: 'exact' })
    .match({ user_id: userId })
    .order('created_at', { ascending: true });

  if (pageParam || limitParam) {
    const page = parseInt(pageParam || '1', 10);
    const limit = parseInt(limitParam || '10', 10);
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }

  const classesWithDescription = data.map((classItem: any) => ({
    ...classItem,
    description: classItem.class_descriptions.length > 0 ? classItem.class_descriptions[0].description : null,
  }));

  return NextResponse.json({ data: classesWithDescription, total: count });
}
