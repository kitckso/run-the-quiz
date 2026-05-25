import type { QuizQuestion, UserAnswers, QuizResult, QuestionResult } from "../types/quiz";

export function gradeQuiz(questions: QuizQuestion[], userAnswers: UserAnswers): QuizResult {
  const questionResults: QuestionResult[] = questions.map((question) => {
    const userAnswer = userAnswers[question.id];
    const isCorrect = checkAnswer(question, userAnswer);

    return {
      question,
      userAnswer: userAnswer ?? (question.type === "multi_select" ? [] : ""),
      isCorrect,
    };
  });

  const score = questionResults.filter((r) => r.isCorrect).length;
  const total = questions.length;

  return {
    score,
    total,
    percentage: total > 0 ? Math.round((score / total) * 100) : 0,
    questionResults,
  };
}

function checkAnswer(question: QuizQuestion, userAnswer: string | string[] | undefined): boolean {
  if (userAnswer === undefined) return false;

  const correct = question.correctAnswer;

  switch (question.type) {
    case "mcq":
    case "true_false":
      return typeof correct === "string" && userAnswer === correct;

    case "multi_select": {
      if (!Array.isArray(correct) || !Array.isArray(userAnswer)) return false;
      if (correct.length !== userAnswer.length) return false;
      const sortedCorrect = [...correct].sort();
      const sortedUser = [...userAnswer].sort();
      return sortedCorrect.every((val, i) => val === sortedUser[i]);
    }

    case "short_answer":
      return (
        typeof correct === "string" &&
        String(userAnswer).trim().toLowerCase() === correct.trim().toLowerCase()
      );

    default:
      return false;
  }
}
