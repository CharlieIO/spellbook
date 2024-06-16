import openai, json, os
from .llm_interface import LLMInterface

class OpenAILLM(LLMInterface):
    def __init__(self):
        openai.api_key = os.environ.get("OPENAI_API_KEY")

    def generate_quiz(self, notes: list, num_questions: int, topics: list) -> dict:
        concatenated_notes = " ".join(notes)
        if topics:
            formatted_topics = ", ".join(f"'{topic}'" for topic in topics)
            system_content = (
                "Generate a quiz in JSON format based on the provided notes (found inside the triple quotes). "
                "The quiz should include question text and multiple-choice answers derived from the notes content. "
                "When you come up with the answer options, try to keep them realistic. "
                f"The quiz should have exactly {num_questions} questions if possible. "
                f"Focus on the topics: {formatted_topics}. If the notes don't touch on the topics, feel free to return an object with no (or very few) questions. "
                "Feel free to make the questions difficult, but make sure they draw from the notes and are useful for the user. "
                "Do not mention \"the notes\" in any form in the questions or answers. For example do not say \"according to the notes\" or, \"as indicated by the notes\". "
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
        else:
            system_content = (
                "Generate a quiz in JSON format based on the provided notes (found inside the triple quotes). "
                "The quiz should include question text and multiple-choice answers derived from the notes content. "
                "When you come up with the answer options, try to keep them realistic."
                f"The quiz should have exactly {num_questions} questions. "
                "Feel free to make the questions difficult, but make sure they draw from the notes and are useful for the user."
                "Do not mention \"the notes\" in any form in the questions or answers. For example do not say \"according to the notes\" or, \"as indicated by the notes\". "
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
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": system_content
                },
                {
                    "role": "user",
                    "content": f"Notes: '''{concatenated_notes}'''",
                }
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message['content'].strip())
    
    def extract_topics(self, text: str) -> list:
        response = self.client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract topics from the provided text. "
                        "The topics should be relevant and concise, capturing only the main ideas and themes. "
                        "Be picky, and if there aren't clear topics, don't feel obligated to include them. Include a max of 5 topics. Fewer topics is better."
                        "If there are no topics, respond with an empty array. "
                        "If there are too many topics, respond with a truncated list of the 5 most relevant topics. Avoid being overly vague with the topics."
                        "Only respond with a JSON object containing a list of topics in the following format: \n"
                        "{\n"
                        "  \"topics\": [\"Topic1\", \"Topic2\", \"Topic3\"]\n"
                        "}"
                    )
                },
                {
                    "role": "user",
                    "content": f"Text: '''{text}'''",
                }
            ],
            model="gpt-4o",
            response_format={"type": "json_object"}
        )
        topics_json = json.loads(response.choices[0].message.content)
        return topics_json.get("topics", [])
