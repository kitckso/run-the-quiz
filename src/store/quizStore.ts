import { create } from "zustand";
import type { QuizData, QuizConfig, QuizResult, Screen } from "../types/quiz";

interface QuizStore {
  screen: Screen;
  quizData: QuizData | null;
  prefilledJson: string;
  quizConfig: QuizConfig;
  currentQuestionIndex: number;
  userAnswers: Record<string, string | string[]>;
  hintsUsed: Record<string, number>;
  quizResult: QuizResult | null;

  setQuizData: (data: QuizData) => void;
  setPrefilledJson: (json: string) => void;
  setScreen: (screen: Screen) => void;
  setQuizConfig: (config: Partial<QuizConfig>) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (questionId: string, answer: string | string[]) => void;
  useHint: (questionId: string) => void;
  setQuizResult: (result: QuizResult | null) => void;
  reset: () => void;
}

const initialState = {
  screen: "home" as Screen,
  quizData: null as QuizData | null,
  prefilledJson: "",
  quizConfig: { timeLimit: null, shuffleQuestions: false },
  currentQuestionIndex: 0,
  userAnswers: {} as Record<string, string | string[]>,
  hintsUsed: {} as Record<string, number>,
  quizResult: null as QuizResult | null,
};

export const useQuizStore = create<QuizStore>((set) => ({
  ...initialState,

  setQuizData: (data) => set({ quizData: data }),

  setPrefilledJson: (json) => set({ prefilledJson: json }),

  setScreen: (screen) => set({ screen }),

  setQuizConfig: (config) =>
    set((state) => ({
      quizConfig: { ...state.quizConfig, ...config },
    })),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setUserAnswer: (questionId, answer) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
    })),

  useHint: (questionId) =>
    set((state) => ({
      hintsUsed: {
        ...state.hintsUsed,
        [questionId]: (state.hintsUsed[questionId] ?? 0) + 1,
      },
    })),

  setQuizResult: (result) => set({ quizResult: result }),

  reset: () => set(initialState),
}));
