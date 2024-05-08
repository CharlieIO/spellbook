import { IDatastoreAccessService } from '../interfaces/IDatastoreAccessService';
import { createClerkSupabaseClient } from '../lib/supabaseClient';

class SupabaseDatastoreAccessService implements IDatastoreAccessService {
    async insertClass(userId: string, className: string): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('classes')
                .insert({ user_id: userId, name: className });
            return { data, error };
        } catch (error) {
            console.error('Error inserting class:', error);
            return { data: null, error };
        }
    }

    async fetchClass(userId: string, classUuid: string): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('classes')
                .select('*')
                .match({ uuid: classUuid, user_id: userId })
                .single();
            return { data, error };
        } catch (error) {
            console.error('Error fetching class:', error);
            return { data: null, error };
        }
    }

    async fetchClassName(classUuid: string): Promise<{ className: string, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('classes')
                .select('name')
                .match({ uuid: classUuid })
                .single();
            if (error) {
                return { className: '', error };
            }
            return { className: data.name, error: null };
        } catch (error) {
            console.error('Error fetching class name:', error);
            return { className: '', error };
        }
    }

    async fetchClassesWithDescription(userId: string): Promise<{ data: any, description: string | null, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('classes')
                .select(`
                  *,
                  class_descriptions(description)
                `, { count: 'exact' })
                .match({ user_id: userId })
                .order('created_at', { ascending: true });
            if (error) {
                console.error('Error fetching classes with descriptions:', error);
                return { data: null, description: null, error };
            }
            const classesWithDescription = data.map((classItem: any) => ({
                ...classItem,
                description: classItem.class_descriptions.length > 0 ? classItem.class_descriptions[0].description : null,
            }));
            return { data: classesWithDescription, description: null, error: null };
        } catch (error) {
            console.error('Error fetching classes with descriptions:', error);
            return { data: null, description: null, error };
        }
    }

    async insertNote(userId: string, classUuid: string, fileKey: string, url: string): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('notes')
                .insert({
                    user_id: userId,
                    class_uuid: classUuid,
                    blob_key: fileKey,
                    url: url
                });
            return { data, error };
        } catch (error) {
            console.error('Error inserting note:', error);
            return { data: null, error };
        }
    }

    async fetchNotes(userId: string, classUuid: string, page: number, limit: number): Promise<{ data: any, error: any, count: number }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error, count } = await client
                .from('notes')
                .select('*')
                .match({ user_id: userId, class_uuid: classUuid })
                .range((page - 1) * limit, page * limit - 1);
            // Ensure count is always a number by providing a fallback value
            const safeCount = count || 0;
            return { data, error, count: safeCount };
        } catch (error) {
            console.error('Error fetching notes:', error);
            return { data: null, error, count: 0 };
        }
    }

    async deleteNote(userId: string, imageKey: string): Promise<{ error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { error } = await client
                .from('notes')
                .delete()
                .match({ blob_key: imageKey, user_id: userId });
            return { error };
        } catch (error) {
            console.error('Error deleting note:', error);
            return { error };
        }
    }

    async insertDescription(classId: string, description: string): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('class_descriptions')
                .insert({ class_id: classId, description: description });
            return { data, error };
        } catch (error) {
            console.error('Error inserting description:', error);
            return { data: null, error };
        }
    }

    async fetchDescriptions(classId: string): Promise<{ descriptions: string[], error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('class_descriptions')
                .select('description')
                .match({ class_id: classId })
                .order('description', { ascending: true });
            if (error) {
                return { descriptions: [], error };
            }
            const descriptions = data.map((item: { description: string }) => item.description);
            return { descriptions, error: null };
        } catch (error) {
            console.error('Error fetching descriptions:', error);
            return { descriptions: [], error };
        }
    }
}

export default SupabaseDatastoreAccessService;

