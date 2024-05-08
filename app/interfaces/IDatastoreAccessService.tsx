export interface IDatastoreAccessService {
    // Class-related methods
    insertClass(userId: string, className: string): Promise<{ data: any, error: any }>;
    fetchClass(userId: string, classUuid: string): Promise<{ data: any, error: any }>;
    fetchClassName(classUuid: string): Promise<{ className: string, error: any }>;
    fetchClassesWithDescription(userId: string, classUuid: string): Promise<{ data: any, description: string | null, error: any }>;

    // Note-related methods
    insertNote(userId: string, classUuid: string, fileKey: string, url: string): Promise<{ data: any, error: any }>;
    fetchNotes(userId: string, classUuid: string, page: number, limit: number): Promise<{ data: any, error: any, count: number }>;
    deleteNote(userId: string, imageKey: string): Promise<{ error: any }>;

    // Description-related methods
    insertDescription(classId: string, description: string): Promise<{ data: any, error: any }>;
    fetchDescriptions(classId: string): Promise<{ descriptions: string[], error: any }>;
}
