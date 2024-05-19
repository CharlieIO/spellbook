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
            console.log('page:', page);
            console.log('limit:', limit);
            const { data, error } = await client
                .from('notes')
                .select('*', { count: 'exact' })
                .match({ user_id: userId, class_uuid: classUuid })
                .range((page - 1) * limit, page * limit - 1);
            const totalNotesCount = await client
                .from('notes')
                .select('*', { count: 'exact', head: true })
                .match({ user_id: userId, class_uuid: classUuid });
            const count = totalNotesCount.count || 0;
            return { data, error, count };
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

    async fetchNoteKeysForClass(classUuid: string): Promise<{ keys: string[], error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('notes')
                .select('blob_key')
                .match({ class_uuid: classUuid });

            if (error) {
                return { keys: [], error };
            }

            const keys = data.map((item: { blob_key: string }) => item.blob_key);
            return { keys, error: null };
        } catch (error) {
            console.error('Error fetching note keys for class:', error);
            return { keys: [], error };
        }
    }

    async saveQuizRecord(quizRecord: { quizUuid: string, classUuid: string, userId: string }): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('quiz_records')
                .insert({
                    quiz_uuid: quizRecord.quizUuid,
                    class_uuid: quizRecord.classUuid,
                    user_id: quizRecord.userId
                });
            return { data, error };
        } catch (error) {
            console.error('Error saving quiz record:', error);
            return { data: null, error };
        }
    }

    async fetchClassNameFromQuizUuid(quizUuid: string): Promise<{ className: string, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('quiz_records')
                .select('class_uuid')
                .eq('quiz_uuid', quizUuid)
                .single();
            if (error) {
                return { className: '', error };
            }

            const classUuid = data.class_uuid;

            const { data: classData, error: classError } = await client
                .from('classes')
                .select('name')
                .eq('uuid', classUuid)
                .single();
            if (classError) {
                return { className: '', error: classError };
            }

            return { className: classData.name, error: null };
        } catch (error) {
            console.error('Error fetching class name from quiz UUID:', error);
            return { className: '', error };
        }
    }
}

export default SupabaseDatastoreAccessService;
