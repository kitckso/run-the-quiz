import { create } from "zustand";
import type { QuizData, QuizConfig, QuizResult, Screen } from "../types/quiz";
import type { SavedResult } from "../lib/storage";

interface QuizStore {
  screen: Screen;
  quizData: QuizData | null;
  prefilledJson: string;
  quizConfig: QuizConfig;
  currentQuestionIndex: number;
  userAnswers: Record<string, string | string[]>;
  hintsUsed: Record<string, number>;
  quizResult: QuizResult | null;
  /** Flag set when a quiz is loaded from a shared URL hash */
  promptCollapsed: boolean;

  setQuizData: (data: QuizData) => void;
  setPrefilledJson: (json: string) => void;
  setScreen: (screen: Screen) => void;
  setQuizConfig: (config: Partial<QuizConfig>) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (questionId: string, answer: string | string[]) => void;
  useHint: (questionId: string) => void;
  setQuizResult: (result: QuizResult | null) => void;
  loadSavedResult: (saved: SavedResult) => void;
  setPromptCollapsed: (val: boolean) => void;
  reset: () => void;
  stopQuiz: () => void;
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
  promptCollapsed: false,
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

  setPromptCollapsed: (val) => set({ promptCollapsed: val }),

  loadSavedResult: (saved) =>
    set({
      quizData: saved.quizData,
      quizResult: {
        score: saved.score,
        total: saved.total,
        percentage: saved.percentage,
        questionResults: saved.questionResults,
      },
      screen: "results",
    }),

  reset: () => set(initialState),

  /** Keep quiz data but reset runtime progress, re-populate JSON, and go home */
  stopQuiz: () =>
    set((state) => ({
      currentQuestionIndex: 0,
      userAnswers: {},
      hintsUsed: {},
      quizResult: null,
      screen: "home",
      // Re-populate the JSON textarea from quizData so the user can see/edit/restart
      prefilledJson: state.quizData ? JSON.stringify(state.quizData, null, 2) : state.prefilledJson,
    })),
}));
