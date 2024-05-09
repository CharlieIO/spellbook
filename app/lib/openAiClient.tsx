import OpenAI from "openai";

// Function to create an OpenAI client
function createOpenAiClient(systemPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY; // Use the environment variable for the API key
  const openaiClient = new OpenAI({
    apiKey: apiKey
  });

  const query = async (openAiQuery: string, params = {}) => {
    try {
      const response = await openaiClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: openAiQuery
          }
        ],
        model: "gpt-4-turbo",
        ...params
      });
      console.log(response);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to fetch from OpenAI: ${error.message}`);
    }
  };

  return { query };
}

// Function to initialize and return OpenAI client
export function getOpenAiClient(systemPrompt: string) {
  const openAiClient = createOpenAiClient(systemPrompt);
  return openAiClient;
}
