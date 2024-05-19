import { NextRequest, NextResponse } from 'next/server';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { IBlobStorageService } from '@/interfaces/IBlobStorageService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobUuid = searchParams.get('jobUuid');

  if (!jobUuid) {
    return NextResponse.json({ error: 'Job UUID is required' }, { status: 400 });
  }

  const blobStorageService: IBlobStorageService = provideBlobStorageService();

  try {
    const quizExists = await blobStorageService.doesQuizExist(jobUuid);

    if (quizExists) {
      return NextResponse.json({ ready: true });
    } else {
      return NextResponse.json({ ready: false });
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'NoSuchKey') {
      return NextResponse.json({ ready: false });
    } else {
      console.error('Error checking quiz existence:', error);
      return NextResponse.json({ ready: false });
    }
  }
}
