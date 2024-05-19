import os, json
from groq import Groq
from .llm_interface import LLMInterface

class GroqLLM(LLMInterface):
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    def generate_quiz(self, notes: list, num_questions: int) -> dict:
        concatenated_notes = " ".join(notes)
        response = self.client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Generate a quiz in JSON format based on the provided notes. "
                        "The quiz should include questions and multiple-choice answers derived from the notes content. "
                        f"The quiz should have exactly {num_questions} questions. "
                        "The questions should focus on the most important information in the text, ensuring they are useful for study purposes. "
                        "Feel free to make them difficult, but make sure they draw from the notes and are useful for the user."
                        "Only respond in the following format: \n"
                        "{\n"
                        "  \"questions\": [\n"
                        "    {\n"
                        "      \"question\": \"string\",\n"
                        "      \"answers\": \"string[]\",\n"
                        "      \"correctAnswerIndex\": \"number\"\n"
                        "    }\n"
                        "  ]\n"
                        "}\n"
                        "Only respond in the above format. "
                        "Do not put your response in quotes."
                    )
                },
                {
                    "role": "user",
                    "content": f"Notes: {concatenated_notes}",
                }
            ],
            model="llama3-70b-8192",
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
