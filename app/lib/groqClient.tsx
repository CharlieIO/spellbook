import Groq from 'groq-sdk';

// Function to create a Groq client
function createGroqClient(systemPrompt: string) {
  const apiKey = process.env.GROQ_API_KEY; // Use the environment variable for the API key
  const groqClient = new Groq({
    apiKey: apiKey
  });

  const query = async (groqQuery: string, params = {}) => {
    try {
      const response = await groqClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: groqQuery
          }
        ],
        model: "llama3-70b-8192",
        ...params
      });
      console.log(systemPrompt);
      console.log(groqQuery);
      console.log(response);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to fetch from Groq: ${error.message}`);
    }
  };

  return { query };
}

// Function to initialize and return Groq client
export function getGroqClient(systemPrompt: string) {
  const groqClient = createGroqClient(systemPrompt);
  return groqClient;
}

