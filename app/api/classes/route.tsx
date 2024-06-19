import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { provideDatastoreService } from '@/services/InstanceProvider';

export async function POST(request: NextRequest) {
  const datastoreService = provideDatastoreService();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();
  const { data, error } = await datastoreService.insertClass(userId, name);

  if (error) {
    console.error('Error inserting class:', error);
    return NextResponse.json({ error: 'Failed to add class' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function GET(request: NextRequest) {
  const datastoreService = provideDatastoreService();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const pageParam = url.searchParams.get('page');
  const limitParam = url.searchParams.get('limit');

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  const offset = (page - 1) * limit;

  const { data, error, count } = await datastoreService.fetchClassesWithMetadata(userId, offset, limit);

  if (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }

  const classesWithNotesAndQuizData = data.classes.map((classItem: any) => ({
    ...classItem,
    notesCount: classItem.pagesCount || 0,
    totalQuizScores: classItem.totalQuizScores || 0,
    averageQuizScore: classItem.averageQuizScore || 0,
  }));

  return NextResponse.json({ data: classesWithNotesAndQuizData, total: count });
}
