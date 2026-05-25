export type QuestionType = "mcq" | "multi_select" | "true_false" | "short_answer";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface QuizData {
  quizTitle: string;
  questions: QuizQuestion[];
}

export type Screen = "home" | "quiz" | "results";

export interface QuizConfig {
  timeLimit: number | null;
  shuffleQuestions: boolean;
}

export interface QuestionResult {
  question: QuizQuestion;
  userAnswer: string | string[];
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  questionResults: QuestionResult[];
}

export type UserAnswers = Record<string, string | string[]>;
