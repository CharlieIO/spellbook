import NavBar from "@/components/NavBar"; // Import the NavBar component
import { QuizSelectionCard } from "@/quizzes/quiz-selection-card";

export default function QuizPage() {
  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto text-center mt-10">
        <h1 className="text-3xl font-bold">Practice</h1>
        <p className="text-lg mt-4">
          Test your knowledge with our variety of quizzes. Choose a category and start your challenge!
        </p>
        <div className="flex justify-center p-12">
          <QuizSelectionCard />
        </div>
      </div>
    </>
  );
}
