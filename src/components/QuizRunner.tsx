import { useEffect, useCallback, useRef, useState } from "react";
import {
  Card,
  Text,
  Progress,
  Group,
  Button,
  Radio,
  Checkbox,
  TextInput,
  Stack,
  Title,
  Paper,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconSend, IconBulb } from "@tabler/icons-react";
import { useQuizStore } from "../store/quizStore";
import { gradeQuiz } from "../lib/grading";
import type { QuizQuestion } from "../types/quiz";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: QuizQuestion;
  value: string | string[];
  onChange: (val: string | string[]) => void;
}) {
  switch (question.type) {
    case "mcq":
    case "true_false":
      return (
        <Radio.Group value={value as string} onChange={onChange}>
          <Stack gap="xs" mt="xs">
            {question.options.map((opt) => (
              <Radio key={opt} value={opt} label={opt} />
            ))}
          </Stack>
        </Radio.Group>
      );

    case "multi_select":
      return (
        <Checkbox.Group value={value as string[]} onChange={(vals) => onChange(vals)}>
          <Stack gap="xs" mt="xs">
            {question.options.map((opt) => (
              <Checkbox key={opt} value={opt} label={opt} />
            ))}
          </Stack>
        </Checkbox.Group>
      );

    case "short_answer":
      return (
        <TextInput
          placeholder="Type your answer..."
          value={value as string}
          onChange={(e) => onChange(e.currentTarget.value)}
          mt="xs"
        />
      );

    default:
      return <Text c="red">Unknown question type: {question.type}</Text>;
  }
}

export function QuizRunner() {
  const quizData = useQuizStore((s) => s.quizData);
  const quizConfig = useQuizStore((s) => s.quizConfig);
  const currentQuestionIndex = useQuizStore((s) => s.currentQuestionIndex);
  const userAnswers = useQuizStore((s) => s.userAnswers);
  const setCurrentQuestionIndex = useQuizStore((s) => s.setCurrentQuestionIndex);
  const setUserAnswer = useQuizStore((s) => s.setUserAnswer);
  const setQuizResult = useQuizStore((s) => s.setQuizResult);
  const setScreen = useQuizStore((s) => s.setScreen);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<() => void>(undefined);

  const questions = quizData?.questions ?? [];
  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!quizData) return;

    const questionsToUse = quizConfig.shuffleQuestions
      ? [...quizData.questions].sort(() => Math.random() - 0.5)
      : quizData.questions;

    const result = gradeQuiz(questionsToUse, userAnswers, useQuizStore.getState().hintsUsed);
    setQuizResult(result);
    setScreen("results");
  }, [quizData, quizConfig.shuffleQuestions, userAnswers, setQuizResult, setScreen]);

  submitRef.current = handleSubmit;

  useEffect(() => {
    if (quizConfig.timeLimit && quizConfig.timeLimit > 0) {
      setTimeLeft(quizConfig.timeLimit * 60);
    }
  }, [quizConfig.timeLimit]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      submitRef.current?.();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const hintsUsedMap = useQuizStore((s) => s.hintsUsed);
  const revealHint = useQuizStore((s) => s.useHint);

  if (!question) {
    return <Text>No questions available.</Text>;
  }

  const currentAnswer = userAnswers[question.id] ?? (question.type === "multi_select" ? [] : "");

  const hasAnswer =
    question.type === "multi_select"
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : typeof currentAnswer === "string" && currentAnswer.trim().length > 0;

  const hints = question.hints ?? [];
  const hintsUsedCount = hintsUsedMap[question.id] ?? 0;
  const remainingHints = hints.length - hintsUsedCount;

  return (
    <Card shadow="sm" padding="lg" radius="md" maw={720} mx="auto">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>{quizData?.quizTitle}</Title>
          {timeLeft !== null && (
            <Text fw={700} c={timeLeft <= 60 ? "red" : undefined}>
              {formatTime(timeLeft)}
            </Text>
          )}
        </Group>

        <Progress value={progress} size="sm" />
        <Text size="sm" c="dimmed" ta="right">
          {currentQuestionIndex + 1} / {questions.length}
        </Text>

        <Paper p="md" withBorder>
          <Text fw={500} size="lg" mb="md">
            {question.questionText}
          </Text>

          {hintsUsedCount > 0 && (
            <Paper p="xs" withBorder mb="sm" bg="var(--mantine-color-yellow-light)">
              <Text size="sm">
                <Text span fw={500}>
                  Hint{": "}
                </Text>
                {hints.slice(0, hintsUsedCount).join(" | ")}
              </Text>
            </Paper>
          )}

          <QuestionRenderer
            question={question}
            value={currentAnswer}
            onChange={(val) => setUserAnswer(question.id, val)}
          />
        </Paper>

        <Group justify="space-between">
          <Group>
            <Button
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <Tooltip
              label={
                hints.length === 0
                  ? "No hints available"
                  : remainingHints === 0
                    ? "No more hints"
                    : "Reveal a hint"
              }
            >
              <ActionIcon
                variant="light"
                color="yellow"
                size="lg"
                disabled={hints.length === 0 || remainingHints === 0}
                onClick={() => revealHint(question.id)}
              >
                <IconBulb size={18} />
              </ActionIcon>
            </Tooltip>
            {hints.length > 0 && (
              <Text size="xs" c="dimmed">
                {hintsUsedCount}/{hints.length}
              </Text>
            )}
          </Group>

          <Button
            rightSection={isLastQuestion ? <IconSend size={16} /> : <IconArrowRight size={16} />}
            onClick={handleNext}
            disabled={!hasAnswer}
          >
            {isLastQuestion ? "Submit Quiz" : "Next"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
