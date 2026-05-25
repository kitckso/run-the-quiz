import { useState } from "react";
import {
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  Stack,
  Group,
  Paper,
  Title,
  Text,
  CopyButton,
  ActionIcon,
  Tooltip,
  Collapse,
  UnstyledButton,
} from "@mantine/core";
import { IconCopy, IconCheck, IconChevronDown } from "@tabler/icons-react";

const QUESTION_TYPES = [
  { value: "mcq", label: "Multiple Choice (Single Option)" },
  { value: "multi_select", label: "Multi-Select (Multiple Correct Options)" },
  { value: "true_false", label: "True / False" },
  { value: "short_answer", label: "Short Answer (Exact Match)" },
];

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "mixed", label: "Mixed" },
];

const JSON_SCHEMA_TEMPLATE = `{
  "quizTitle": "string",
  "questions": [
    {
      "id": "string",
      "type": "mcq | multi_select | true_false | short_answer",
      "questionText": "string",
      "options": ["string"],
      "correctAnswer": "string | string[]",
      "explanation": "string"
    }
  ]
}`;

export function PromptGenerator() {
  const [opened, setOpened] = useState(true);
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState<number | string>("");
  const [difficulty, setDifficulty] = useState<string | null>("medium");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["mcq"]);

  const generatePrompt = (): string => {
    const typesList =
      selectedTypes.length > 0
        ? `Question Types: ${selectedTypes
            .map((t) => QUESTION_TYPES.find((qt) => qt.value === t)?.label ?? t)
            .join(", ")}`
        : "Question Types: Any type (you decide based on the topic)";

    const countInstruction =
      numQuestions !== "" && Number(numQuestions) > 0
        ? `Number of Questions: ${numQuestions}`
        : "Number of Questions: Decide the optimal number of questions based on the topic and depth.";

    const diffInstruction = difficulty
      ? `Difficulty Level: ${DIFFICULTY_OPTIONS.find((d) => d.value === difficulty)?.label ?? difficulty}`
      : "";

    return `You are a quiz generation AI. Create a quiz based on the following specifications.

Topic / Context:
${topic}

${countInstruction}
${diffInstruction}
${typesList}

CRITICAL: Your response MUST be ONLY valid JSON. No markdown formatting, no code blocks, no explanation. Return ONLY the raw JSON object.

Every question object MUST include ALL of these fields. Do not omit any:
- "id" (string, unique)
- "questionText" (string - the actual question text)
- "type" (string - one of: mcq, multi_select, true_false, short_answer)
- "options" (array of strings)
- "correctAnswer" (string or array of strings)
- "explanation" (string)

The JSON must conform EXACTLY to this schema:
${JSON_SCHEMA_TEMPLATE}

EXAMPLE of a correct question object:
{
  "id": "q1",
  "questionText": "What is the capital of France?",
  "type": "mcq",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "correctAnswer": "Paris",
  "explanation": "Paris has been the capital of France since the 10th century."
}

Rules:
- Every question MUST have a non-empty "questionText" field. This is the most commonly missed field.
- "id" must be a unique string identifier for each question (e.g., "q1", "q2").
- For "mcq" type, "correctAnswer" is a single string matching one of the "options".
- For "multi_select" type, "correctAnswer" is an array of strings.
- For "true_false" type, use options ["True", "False"] and "correctAnswer" is "True" or "False".
- For "short_answer" type, "options" can be empty array and "correctAnswer" is the exact expected answer string.
- "explanation" should explain why the correct answer is right.

Double-check each question object before outputting. Every single one must have "questionText", "id", "type", "options", "correctAnswer", and "explanation".`;
  };

  const prompt = topic.trim() ? generatePrompt() : "";

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <UnstyledButton onClick={() => setOpened((o) => !o)} style={{ width: "100%" }}>
        <Group justify="space-between" wrap="nowrap">
          <Title order={3}>AI Prompt Generator</Title>
          <IconChevronDown
            size={20}
            style={{
              transform: opened ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          />
        </Group>
      </UnstyledButton>

      <Collapse in={opened}>
        <Text c="dimmed" size="sm" my="lg">
          Fill out the form below to generate a structured prompt for any AI.
        </Text>

        <Stack gap="md">
          <Textarea
            label="Topic / Context"
            description="Detailed description of the quiz subject"
            placeholder="e.g., A quiz about the solar system covering planets, orbits, and key facts..."
            minRows={3}
            value={topic}
            onChange={(e) => setTopic(e.currentTarget.value)}
          />

          <NumberInput
            label="Number of Questions"
            description="Leave blank to let the AI decide"
            placeholder="Auto"
            value={numQuestions}
            onChange={setNumQuestions}
            min={1}
            max={100}
            allowNegative={false}
            allowDecimal={false}
          />

          <Select
            label="Difficulty"
            data={DIFFICULTY_OPTIONS}
            value={difficulty}
            onChange={setDifficulty}
            allowDeselect={false}
          />

          <Checkbox.Group
            label="Question Types"
            description="Select one or more question types"
            value={selectedTypes}
            onChange={setSelectedTypes}
          >
            <Group mt="xs">
              {QUESTION_TYPES.map((type) => (
                <Checkbox key={type.value} value={type.value} label={type.label} />
              ))}
            </Group>
          </Checkbox.Group>

          {prompt && (
            <Paper p="sm" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                  Generated Prompt
                </Text>
                <CopyButton value={prompt}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? "Copied" : "Copy"}>
                      <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
              <Textarea
                readOnly
                minRows={8}
                maxRows={14}
                autosize
                value={prompt}
                styles={{ input: { fontFamily: "monospace", fontSize: 13 } }}
              />
            </Paper>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
}
