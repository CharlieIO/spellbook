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
        } catch (err) {
            console.error('Error inserting class:', err);
            return { data: null, error: err };
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
        } catch (err) {
            console.error('Error fetching class:', err);
            return { data: null, error: err };
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
        } catch (err) {
            console.error('Error fetching class name:', err);
            return { className: '', error: err };
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
        } catch (err) {
            console.error('Error fetching classes with descriptions:', err);
            return { data: null, description: null, error: err };
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
        } catch (err) {
            console.error('Error inserting note:', err);
            return { data: null, error: err };
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
        } catch (err) {
            console.error('Error fetching notes:', err);
            return { data: null, error: err, count: 0 };
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
        } catch (err) {
            console.error('Error deleting note:', err);
            return { error: err };
        }
    }

    async insertDescription(classId: string, description: string): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            const { data, error } = await client
                .from('class_descriptions')
                .insert({ class_id: classId, description: description });
            return { data, error };
        } catch (err) {
            console.error('Error inserting description:', err);
            return { data: null, error: err };
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
        } catch (err) {
            console.error('Error fetching descriptions:', err);
            return { descriptions: [], error: err };
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
        } catch (err) {
            console.error('Error fetching note keys for class:', err);
            return { keys: [], error: err };
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
        } catch (err) {
            console.error('Error saving quiz record:', err);
            return { data: null, error: err };
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
        } catch (err) {
            console.error('Error fetching class name from quiz UUID:', err);
            return { className: '', error: err };
        }
    }

    async saveQuizScore(quizScore: { quizUuid: string, userId: string, score: number }): Promise<{ data: any, error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            // Check if a score already exists for the given quizUuid
            const { data: existingScore, error: fetchError } = await client
                .from('quiz_scores')
                .select('quiz_uuid')
                .eq('quiz_uuid', quizScore.quizUuid)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the code for "No rows found"
                return { data: null, error: fetchError };
            }

            if (existingScore) {
                return { data: null, error: 'A score for this quiz already exists.' };
            }

            const { data, error } = await client
                .from('quiz_scores')
                .insert({
                    quiz_uuid: quizScore.quizUuid,
                    score: quizScore.score
                });
            return { data, error };
        } catch (err) {
            console.error('Error saving quiz score:', err);
            return { data: null, error: err };
        }
    }

    async fetchAllQuizScoresForClass(classUuid: string): Promise<{ scores: { quizUuid: string, score: number, createdAt: string }[], error: any }> {
        const client = await createClerkSupabaseClient();
        try {
            // Fetch all quiz UUIDs for the given class UUID
            const { data: quizRecords, error: quizRecordsError } = await client
                .from('quiz_records')
                .select('quiz_uuid')
                .eq('class_uuid', classUuid);

            if (quizRecordsError) {
                return { scores: [], error: quizRecordsError };
            }

            const quizUuids = quizRecords.map((record: { quiz_uuid: string }) => record.quiz_uuid);

            // Fetch all scores for the quiz UUIDs
            const { data: scoresData, error: scoresError } = await client
                .from('quiz_scores')
                .select('quiz_uuid, score, created_at')
                .in('quiz_uuid', quizUuids);

            if (scoresError) {
                return { scores: [], error: scoresError };
            }

            const formattedScores = scoresData.map((score: { quiz_uuid: string, score: number, created_at: string }) => ({
                quizUuid: score.quiz_uuid,
                score: score.score,
                createdAt: score.created_at
            }));

            return { scores: formattedScores, error: null };
        } catch (err) {
            console.error('Error fetching scores for class:', err);
            return { scores: [], error: err };
        }
    }
}

export default SupabaseDatastoreAccessService;
