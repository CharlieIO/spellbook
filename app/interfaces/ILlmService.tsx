export interface ILlmService {
  generateDescriptionForClass(className: string): Promise<string>;
  generateQuizJsonFromNotes(notes: string[], numQuestions: number): Promise<string>;
  generateReviewTopics(wrongQuestions: { question: string; answerChoices: string[]; correctAnswer: string }[]): Promise<string[]>;
}
