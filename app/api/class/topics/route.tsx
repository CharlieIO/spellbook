import { NextRequest, NextResponse } from 'next/server';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { provideDatastoreService } from '@/services/InstanceProvider';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    const datastoreService = provideDatastoreService();
    const blobStorageService = provideBlobStorageService();
    const { userId } = auth();
    const url = new URL(req.url);
    const classUuid = url.searchParams.get('classUuid');

    if (!userId || !classUuid) {
        console.error('Unauthorized access attempt or missing class UUID');
        return new NextResponse(JSON.stringify({ error: 'Unauthorized or missing class UUID' }), { status: 401 });
    }

    try {
        // Fetch note keys for the class
        const { keys, error: fetchKeysError } = await datastoreService.fetchNoteKeysForClass(classUuid);

        if (fetchKeysError) {
            console.error('Error fetching note keys:', fetchKeysError);
            return new NextResponse(JSON.stringify({ error: 'Failed to fetch note keys' }), { status: 500 });
        }

        // Fetch topics for the note keys
        const topics = await blobStorageService.getTopicsForNoteKeys(keys);

        // De-duplicate topics
        const uniqueTopics = Array.from(new Set(topics));

        return new NextResponse(JSON.stringify({ topics: uniqueTopics }), { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
