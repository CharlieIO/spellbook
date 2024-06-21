import { NextRequest, NextResponse } from 'next/server';
import { provideDatastoreService, provideBlobStorageService } from '@/services/InstanceProvider';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    const datastoreService = provideDatastoreService();
    const blobStorageService = provideBlobStorageService();
    const { userId } = auth();
    const url = new URL(req.url);
    const classUuid = url.searchParams.get('classUuid');

    if (!userId || !classUuid) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized or missing class UUID' }), { status: 401 });
    }

    try {
        const { keys, error } = await datastoreService.fetchNoteKeysForClass(classUuid);

        if (error) {
            return new NextResponse(JSON.stringify({ error: 'Failed to fetch note keys' }), { status: 500 });
        }

        const totalNotes = keys.length;
        let processedNotes = 0;
        let unprocessedNotes = 0;

        for (const key of keys) {
            const topics = await blobStorageService.getTopicsForNoteKeys([key]);
            if (topics && topics.length > 0) {
                processedNotes++;
            } else {
                unprocessedNotes++;
            }
        }

        return new NextResponse(JSON.stringify({ processedNotes, unprocessedNotes, totalNotes }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
