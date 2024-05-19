export async function pollQuizStatus(quizJobUuid: string, onQuizGenerated: (quizData: any) => void) {
    const interval = parseInt(process.env.POLL_INTERVAL_MS || '5000', 10); // Poll every 5 seconds
    const maxAttempts = parseInt(process.env.MAX_POLL_ATTEMPTS || '20', 10); // Stop after 20 attempts (100 seconds)
  
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await fetchQuizStatus(quizJobUuid);
      if (status && status.quiz) {
        onQuizGenerated(status.quiz);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  
    console.error('Quiz generation timed out');
  }
  
  async function fetchQuizStatus(quizJobUuid: string) {
    try {
      const response = await fetch(`/api/quizzes/status?jobUuid=${quizJobUuid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const quizStatus = await response.json();
      return quizStatus;
    } catch (error) {
      console.error('Failed to fetch quiz status:', error);
      return null;
    }
  }