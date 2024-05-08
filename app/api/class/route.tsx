import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { provideDatastoreService } from '@/services/InstanceProvider';
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';

export async function GET(request: NextRequest) {
  const { userId } = auth();
  const datastoreService: IDatastoreAccessService = provideDatastoreService();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const classUuid = url.searchParams.get('uuid');

  if (!classUuid) {
    return NextResponse.json({ error: 'Class UUID is required' }, { status: 400 });
  }

  const { data, error } = await datastoreService.fetchClass(userId, classUuid);

  if (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }

  return NextResponse.json({ data });
}
