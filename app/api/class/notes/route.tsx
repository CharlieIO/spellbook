import { NextRequest, NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { provideBlobStorageService } from '@/services/InstanceProvider';
import { auth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
    const blobStorageService = provideBlobStorageService();
    const supabaseClient = await createClerkSupabaseClient();
    let body;

    const { userId } = auth();

    if (!userId) {
        console.error('Unauthorized access attempt');
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    
    try {
        body = await req.json();
    } catch (error) {
        console.error('Error parsing JSON from request:', error);
        return new NextResponse(JSON.stringify({ error: 'Invalid JSON in request' }), { status: 400 });
    }

    const { classUuid } = body;
    const numberOfFiles = body.numberOfFiles;

    if (!numberOfFiles || numberOfFiles <= 0) {
        console.error('Validation Error: No files count provided');
        return new NextResponse(JSON.stringify({ error: 'No files count provided' }), { status: 400 });
    }

    try {
        const responses = await Promise.all(Array.from({ length: numberOfFiles }).map(async (_, index) => {
            const fileKey = uuidv4(); // Generate a unique key for each file
            let presignedUrl;

            try {
                presignedUrl = await blobStorageService.generateSignedUrl(fileKey);
            } catch (error) {
                console.error(`Error generating signed URL for ${fileKey}:`, error);
                throw new Error(`Failed to generate signed URL for file index ${index}`);
            }

            // Insert record into the database
            const { data, error } = await supabaseClient.from('notes').insert({
                user_id: userId,
                class_uuid: classUuid,
                blob_key: fileKey,
                url: presignedUrl
            });

            if (error) {
                console.error('DB Insert Error:', error);
                throw new Error('Failed to insert file record into the database');
            }

            return { presignedUrl, fileKey };
        }));

        console.log('All files processed successfully:', responses);
        return new NextResponse(JSON.stringify(responses), { status: 200 });
    } catch (error) {
        console.error('Error processing files:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to process files' }), { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    console.log('Initializing supabase client and blob storage service');
    const supabaseClient = await createClerkSupabaseClient();
    const blobStorageService = provideBlobStorageService();
    console.log('Authenticating user');
    const { userId } = auth();
    const url = new URL(req.url);
    const classUuid = url.searchParams.get('classUuid');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    console.log(`Received parameters: userId=${userId}, classUuid=${classUuid}, page=${page}, limit=${limit}`);

    if (!userId || !classUuid) {
        console.error('Unauthorized access attempt or missing class UUID');
        return new NextResponse(JSON.stringify({ error: 'Unauthorized or missing class UUID' }), { status: 401 });
    }

    try {
        console.log('Fetching notes from database');
        const { count } = await supabaseClient
            .from('notes')
            .select('id, blob_key', { count: 'exact' })
            .match({ user_id: userId, class_uuid: classUuid });

        // Ensure count is not null before calculating totalPages
        const totalPages = count ? Math.ceil(count / limit) : 0;

        const { data, error } = await supabaseClient
            .from('notes')
            .select('id, blob_key')
            .match({ user_id: userId, class_uuid: classUuid })
            .order('created_at', { ascending: true })
            .range(offset, offset + limit - 1);

        console.log('Fetched notes data:', data);

        if (error) {
            console.error('Error fetching notes:', error);
            return new NextResponse(JSON.stringify({ error: 'Failed to fetch notes' }), { status: 500 });
        }

        console.log('Notes fetched successfully, processing images');
        const images = await Promise.all(data.map(async note => {
            try {
                console.log(`Fetching signed URL for display for note id=${note.id}`);
                const signedUrl = await blobStorageService.getSignedUrlForDisplay(note.blob_key);
                return { url: signedUrl, key: note.blob_key };
            } catch (error) {
                console.error(`Error fetching signed URL for note ${note.id}:`, error);
                return null; // Return null in case of error fetching signed URL
            }
        }));

        console.log('All signed URLs processed successfully');
        return new NextResponse(JSON.stringify({ images: images.filter(image => image !== null), totalPages: totalPages }), { status: 200 });
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const supabaseClient = await createClerkSupabaseClient();
    const { userId } = auth();
    const blobStorageService = provideBlobStorageService(); // Assuming BlobStorageService is imported and instantiated correctly

    if (!userId) {
        console.error('Unauthorized delete attempt');
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (error) {
        console.error('Error parsing JSON from request:', error);
        return new NextResponse(JSON.stringify({ error: 'Invalid JSON in request' }), { status: 400 });
    }

    const { imageKey } = body;

    if (!imageKey) {
        console.error('Validation Error: No image key provided');
        return new NextResponse(JSON.stringify({ error: 'No image key provided' }), { status: 400 });
    }

    try {
        const { error: dbError } = await supabaseClient
            .from('notes')
            .delete()
            .match({ blob_key: imageKey, user_id: userId });

        if (dbError) {
            console.error('DB Delete Error:', dbError);
            return new NextResponse(JSON.stringify({ error: 'Failed to delete image' }), { status: 500 });
        }

        try {
            await blobStorageService.deleteFile(imageKey);
            console.log(`Image deleted successfully from storage and database: ${imageKey}`);
            return new NextResponse(JSON.stringify({ message: 'Image deleted successfully' }), { status: 200 });
        } catch (storageError) {
            console.error('Storage Delete Error:', storageError);
            return new NextResponse(JSON.stringify({ error: 'Failed to delete image from storage' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
