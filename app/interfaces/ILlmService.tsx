export interface ILlmService {
  generateDescriptionForClass(className: string): Promise<string>;
  generateQuizJsonFromNotes(notes: string[], numQuestions: number): Promise<string>;
}
