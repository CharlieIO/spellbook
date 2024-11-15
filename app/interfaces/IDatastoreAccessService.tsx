export interface IDatastoreAccessService {
    // Class-related methods
    insertClass(userId: string, className: string): Promise<{ data: any, error: any }>;
    fetchClass(userId: string, classUuid: string): Promise<{ data: any, error: any }>;
    fetchClassesWithMetadata(userId: string, offset: number, limit: number): Promise<{ data: any, error: any, count: number }>;
    fetchClassName(classUuid: string): Promise<{ className: string, error: any }>;
    fetchClassNameFromQuizUuid(quizUuid: string): Promise<{ className: string, error: any }>;
    fetchClassesWithDescription(userId: string, classUuid: string): Promise<{ data: any, description: string | null, error: any }>;

    // Note-related methods
    insertNote(userId: string, classUuid: string, fileKey: string, url: string): Promise<{ data: any, error: any }>;
    fetchNotes(userId: string, classUuid: string, page: number, limit: number): Promise<{ data: any, error: any, count: number }>;
    deleteNote(userId: string, imageKey: string): Promise<{ error: any }>;
    fetchNoteKeysForClass(classUuid: string): Promise<{ keys: string[], error: any }>;

    // Description-related methods
    insertDescription(classId: string, description: string): Promise<{ data: any, error: any }>;
    fetchDescriptions(classId: string): Promise<{ descriptions: string[], error: any }>;

    // Quiz-related methods
    saveQuizRecord(quizRecord: { quizUuid: string, classUuid: string, userId: string }): Promise<{ data: any, error: any }>;
    saveQuizScore(quizScore: { quizUuid: string, score: number }): Promise<{ data: any, error: any }>;
    fetchAllQuizScoresForClass(classUuid: string): Promise<{ scores: { quizUuid: string, score: number, createdAt: string }[], error: any }>;
}
