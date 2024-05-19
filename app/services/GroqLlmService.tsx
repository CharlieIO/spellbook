import { ILlmService } from '@/interfaces/ILlmService';
import { getGroqClient } from '@/lib/groqClient';

export class GroqLlmService implements ILlmService {
  async generateDescriptionForClass(className: string): Promise<string> {
    if (!className) {
      throw new Error('Class name is required');
    }

    const groqClient = await getGroqClient(
      "Generate a class description based on the class name. " +
      "Only respond with the description, nothing else. " +
      "Do not put your response in quotes. " +
      "Make sure to keep your response short and concise. " +
      "Use, at most, 10 words." +
      "Do not use the word 'class' in the description." +
      "If the class name seems like gibberish or is otherwise unrelated to a real class, return a funny description."
    );

    if (!groqClient) {
      throw new Error('Groq client initialization failed');
    }
    const response = await groqClient.query(`Generate a short description for a class named ${className}`);
    if (!response || (response as any).error) {
      throw new Error('Failed to generate description');
    }

    return response.choices[0].message.content;
  }

  async generateQuizJsonFromNotes(notes: string[], numQuestions: number): Promise<string> {
    if (!notes || notes.length === 0) {
      throw new Error('Notes are required to generate a quiz');
    }

    const concatenatedNotes = notes.join(' '); // Concatenate all notes into a single string

    const groqClient = await getGroqClient(
      "Generate a quiz in JSON format based on the provided notes. " +
      "The quiz should include questions and multiple-choice answers derived from the notes content." +
      "The quiz should have at most " + numQuestions + " questions." +
      "Only respond in the following format: \n" +
      "{\n" +
      "  \"questions\": [\n" +
      "    {\n" +
      "      \"question\": \"string\",\n" +
      "      \"answers\": \"string[]\",\n" +
      "      \"correctAnswerIndex\": \"number\"\n" +
      "    }\n" +
      "  ]\n" +
      "}\n" +
      "Only respond in the above format." +
      "Do not put your response in quotes."
    );

    if (!groqClient) {
      throw new Error('Groq client initialization failed');
    }

    const response = await groqClient.query(`Generate a quiz JSON from the following notes: ${concatenatedNotes}`, {
      "response_format": {"type": "json_object"}
    });
    if (!response || (response as any).error) {
      throw new Error('Failed to generate quiz JSON');
    }

    return response.choices[0].message.content;
  }

  async generateReviewTopics(wrongQuestions: { question: string; answerChoices: string[]; correctAnswer: string }[]): Promise<string[]> {
    if (!wrongQuestions || wrongQuestions.length === 0) {
      throw new Error('Wrong questions are required to generate review topics');
    }

    const groqClient = await getGroqClient(
      "Generate at most 10 most-important review topics based on the provided wrong questions from a quiz the user answered incorrectly. " +
      "Only generate topics that are related to the wrong questions, and make sure they're sufficiently specific. " +
      "Respond in JSON format with an array of topics to review, each followed by a short sentence describing why it's important. " +
      "The response should be in the following format: \n" +
      "{\n" +
      "  \"topics\": [\n" +
      "    {\n" +
      "      \"topic\": \"string\",\n" +
      "      \"importance\": \"string\"\n" +
      "    }\n" +
      "  ]\n" +
      "}\n" +
      "Do not put your response in quotes. " +
      "Make sure to keep your response short and concise."
    );

    if (!groqClient) {
      throw new Error('Groq client initialization failed');
    }

    const response = await groqClient.query(`Generate review topics from the following wrong questions: ${JSON.stringify(wrongQuestions)}`, {
      "response_format": {"type": "json_object"},
    });
    if (!response || (response as any).error) {
      throw new Error('Failed to generate review topics');
    }

    const jsonResponse = JSON.parse(response.choices[0].message.content);
    if (!jsonResponse.topics || !Array.isArray(jsonResponse.topics)) {
      throw new Error('Invalid response format');
    }

    return jsonResponse.topics;
  }
}
