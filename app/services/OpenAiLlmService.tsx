import { ILlmService } from '@/interfaces/ILlmService';
import { getOpenAiClient } from '@/lib/openAiClient';

export class OpenAiLlmService implements ILlmService {
  async generateDescriptionForClass(className: string): Promise<string> {
    if (!className) {
      throw new Error('Class name is required');
    }

    const openAiClient = await getOpenAiClient(
      "Generate a class description based on the class name. " +
      "Only respond with the description, nothing else. " +
      "Do not put your response in quotes. " +
      "Make sure to keep your response short and concise. " +
      "Use, at most, 10 words." +
      "Do not use the word 'class' in the description." +
      "If the class name seems like gibberish or is otherwise unrelated to a real class, return a funny description."
    );

    if (!openAiClient) {
      throw new Error('OpenAI client initialization failed');
    }
    const response = await openAiClient.query(`Generate a short description for a class named ${className}`);
    if (!response || (response as any).error) {
      throw new Error('Failed to generate description');
    }

    const description = response.choices[0].message.content;
    if (description === null) {
      throw new Error('Description is null');
    }

    return description;
  }

  async generateQuizJsonFromNotes(notes: string[], numQuestions: number): Promise<string> {
    if (!notes || notes.length === 0) {
      throw new Error('Notes are required to generate a quiz');
    }

    const concatenatedNotes = notes.join(' '); // Concatenate all notes into a single string

    const openAiClient = await getOpenAiClient(
      "Generate a quiz in JSON format based on the provided notes. " +
      "The quiz should include questions and multiple-choice answers derived from the notes content." +
      "The quiz should have as many questions as possible" +
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

    if (!openAiClient) {
      throw new Error('OpenAI client initialization failed');
    }

    const response = await openAiClient.query(`Please generate a quiz JSON with at least 4000 tokens from the following notes: ${concatenatedNotes}`, {
      "response_format": {"type": "json_object"},
      "max_tokens": 4096
    });
    if (!response || (response as any).error) {
      throw new Error('Failed to generate quiz JSON');
    }

    const quizJson = response.choices[0].message.content;
    if (quizJson === null) {
      throw new Error('Quiz JSON is null');
    }

    return quizJson;
  }
}