import type { QuizData, QuizResult } from "../types/quiz";

const HISTORY_KEY = "run-the-quiz-history";
const QUIZZES_KEY = "run-the-quiz-saved";

// ── Result history ──

export interface SavedResult {
  id: string;
  quizTitle: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  quizData: QuizData;
  questionResults: QuizResult["questionResults"];
}

export function saveResult(result: QuizResult, quizData: QuizData): void {
  const history = loadHistory();
  const entry: SavedResult = {
    id: crypto.randomUUID(),
    quizTitle: quizData.quizTitle,
    date: new Date().toLocaleString(),
    score: result.score,
    total: result.total,
    percentage: result.percentage,
    quizData,
    questionResults: result.questionResults,
  };
  history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadHistory(): SavedResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedResult[];
  } catch {
    return [];
  }
}

export function deleteHistoryEntry(id: string): void {
  const history = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Saved quizzes ──

export interface SavedQuiz {
  id: string;
  quizTitle: string;
  date: string;
  questionCount: number;
  json: string;
}

export function saveQuiz(quizData: QuizData): void {
  const list = loadSavedQuizzes();
  const entry: SavedQuiz = {
    id: crypto.randomUUID(),
    quizTitle: quizData.quizTitle,
    date: new Date().toLocaleString(),
    questionCount: quizData.questions.length,
    json: JSON.stringify(quizData, null, 2),
  };
  list.push(entry);
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(list));
}

export function loadSavedQuizzes(): SavedQuiz[] {
  try {
    const raw = localStorage.getItem(QUIZZES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedQuiz[];
  } catch {
    return [];
  }
}
