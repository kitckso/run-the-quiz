import { useState, useCallback, useEffect } from "react";
import {
  JsonInput,
  Paper,
  Title,
  Text,
  Stack,
  Switch,
  NumberInput,
  Alert,
  Button,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconPlayerPlay, IconBolt, IconDeviceFloppy } from "@tabler/icons-react";
import { useQuizStore } from "../store/quizStore";
import { saveQuiz } from "../lib/storage";
import type { QuizData } from "../types/quiz";

export function JsonIngestion() {
  const setQuizData = useQuizStore((s) => s.setQuizData);
  const setScreen = useQuizStore((s) => s.setScreen);
  const quizConfig = useQuizStore((s) => s.quizConfig);
  const setQuizConfig = useQuizStore((s) => s.setQuizConfig);
  const prefilledJson = useQuizStore((s) => s.prefilledJson);
  const setPrefilledJson = useQuizStore((s) => s.setPrefilledJson);
  const storedQuizData = useQuizStore((s) => s.quizData);

  const [jsonValue, setJsonValue] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<QuizData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefilledJson) {
      setJsonValue(prefilledJson);
      setSaved(false);
      try {
        const parsed = JSON.parse(prefilledJson) as QuizData;
        if (parsed.quizTitle && Array.isArray(parsed.questions)) {
          setParsedData(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, [prefilledJson]);

  const handleJsonChange = useCallback(
    (value: string) => {
      setJsonValue(value);
      setParseError(null);
      setParsedData(null);
      setSaved(false);
      setPrefilledJson("");

      if (!value.trim()) return;

      try {
        const parsed = JSON.parse(value) as QuizData;

        if (!parsed.quizTitle || typeof parsed.quizTitle !== "string") {
          setParseError('Missing or invalid "quizTitle" field.');
          return;
        }

        if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          setParseError('Missing or empty "questions" array.');
          return;
        }

        for (const [i, q] of parsed.questions.entries()) {
          if (!q.id) {
            setParseError(`Question ${i + 1} is missing "id".`);
            return;
          }
          if (!q.questionText) {
            setParseError(`Question ${i + 1} is missing "questionText".`);
            return;
          }
          if (!["mcq", "multi_select", "true_false", "short_answer"].includes(q.type)) {
            setParseError(`Question ${i + 1} has invalid type "${q.type}".`);
            return;
          }
        }

        setParsedData(parsed);
      } catch {
        setParseError("Invalid JSON format. Please check your input.");
      }
    },
    [setPrefilledJson],
  );

  const activeData = parsedData ?? storedQuizData;
  const showConfig = activeData !== null;

  const handleStart = () => {
    if (!activeData) return;
    setQuizData(activeData);
    setScreen("quiz");
  };

  return (
    <>
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={3} mb="md">
          Paste Quiz JSON
        </Title>
        <Text c="dimmed" size="sm" mb="lg">
          Paste the JSON output from the AI or load from a shared link.
        </Text>

        <Stack gap="md">
          <Button
            variant="light"
            leftSection={<IconBolt size={18} />}
            onClick={() => {
              const demo = `{
  "quizTitle": "General Knowledge Demo",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "questionText": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "correctAnswer": "Paris",
      "explanation": "Paris has been the capital of France since the 10th century.",
      "hints": ["This city is known as the City of Light", "It is located on the River Seine"]
    },
    {
      "id": "q2",
      "type": "true_false",
      "questionText": "The Earth is flat.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "explanation": "The Earth is an oblate spheroid, not flat.",
      "hints": ["Ancient sailors noticed ships disappearing hull-first over the horizon"]
    },
    {
      "id": "q3",
      "type": "multi_select",
      "questionText": "Which of the following are programming languages?",
      "options": ["Python", "HTML", "JavaScript", "CSS"],
      "correctAnswer": ["Python", "JavaScript"],
      "explanation": "Python and JavaScript are programming languages. HTML and CSS are markup/styling languages.",
      "hints": ["Two are correct", "One of them is named after a snake"]
    },
    {
      "id": "q4",
      "type": "short_answer",
      "questionText": "What year did World War II end?",
      "options": [],
      "correctAnswer": "1945",
      "explanation": "World War II ended in 1945 with the surrender of Germany and Japan."
    }
  ]
}`;
              setJsonValue(demo);
              handleJsonChange(demo);
            }}
          >
            Load Demo Quiz
          </Button>
          <JsonInput
            label="Quiz JSON Data"
            placeholder='{"quizTitle": "...", "questions": [...]}'
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={6}
            maxRows={12}
            value={jsonValue}
            onChange={handleJsonChange}
          />

          {parseError && (
            <Alert icon={<IconAlertCircle size={16} />} title="Validation Error" color="red">
              {parseError}
            </Alert>
          )}

          {showConfig && (
            <>
              <Paper p="sm" withBorder>
                <Text fw={500}>{activeData.quizTitle}</Text>
                <Text size="sm" c="dimmed">
                  {activeData.questions.length} question
                  {activeData.questions.length !== 1 ? "s" : ""}
                </Text>
              </Paper>

              <Switch
                label="Shuffle Questions"
                description="Randomize the order of questions"
                checked={quizConfig.shuffleQuestions}
                onChange={(e) => setQuizConfig({ shuffleQuestions: e.currentTarget.checked })}
              />

              <Switch
                label="Time Limit"
                description="Enable a countdown timer"
                checked={quizConfig.timeLimit !== null}
                onChange={(e) =>
                  setQuizConfig({
                    timeLimit: e.currentTarget.checked ? 10 : null,
                  })
                }
              />

              {quizConfig.timeLimit !== null && (
                <NumberInput
                  label="Duration (minutes)"
                  value={quizConfig.timeLimit}
                  onChange={(val) => setQuizConfig({ timeLimit: val === "" ? null : Number(val) })}
                  min={1}
                  max={180}
                  allowNegative={false}
                  allowDecimal={false}
                />
              )}

              <Group justify="center" mt="md">
                <Button size="lg" leftSection={<IconPlayerPlay size={20} />} onClick={handleStart}>
                  Start Quiz
                </Button>
                <Button
                  size="lg"
                  variant="light"
                  leftSection={<IconDeviceFloppy size={20} />}
                  onClick={() => {
                    saveQuiz(activeData);
                    setSaved(true);
                  }}
                  color={saved ? "green" : undefined}
                >
                  {saved ? "Saved" : "Save Quiz"}
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </>
  );
}
