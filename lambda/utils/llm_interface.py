from abc import ABC, abstractmethod

class LLMInterface(ABC):
    @abstractmethod
    def generate_quiz(self, notes: list, num_questions: int) -> dict:
        pass