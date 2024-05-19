import openai, json, os
from .llm_interface import LLMInterface

class OpenAILLM(LLMInterface):
    def __init__(self):
        openai.api_key = os.environ.get("OPENAI_API_KEY")

    def generate_quiz(self, notes: list, num_questions: int) -> dict:
        concatenated_notes = " ".join(notes)
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Generate a quiz in JSON format based on the provided notes. "
                        "The quiz should include questions and multiple-choice answers derived from the notes content. "
                        f"The quiz should have exactly {num_questions} questions. "
                        "The questions should focus on the most important information in the text, ensuring they are useful for study purposes. "
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
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message['content'].strip())
