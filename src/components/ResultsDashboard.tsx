import { useState } from "react";
import {
  Card,
  Text,
  Title,
  Stack,
  Group,
  Accordion,
  ThemeIcon,
  Button,
  Paper,
  RingProgress,
  Center,
} from "@mantine/core";
import { IconCheck, IconX, IconShare } from "@tabler/icons-react";
import { useQuizStore } from "../store/quizStore";
import { ShareModal } from "./ShareModal";

function displayAnswer(answer: string | string[]): string {
  if (Array.isArray(answer)) return answer.join(", ");
  return answer;
}

function scoreLabel(percentage: number): string {
  if (percentage === 100) return "Perfect!";
  if (percentage >= 80) return "Great job!";
  if (percentage >= 60) return "Good effort";
  if (percentage >= 40) return "Getting there";
  if (percentage > 0) return "Needs improvement";
  return "No correct answers";
}

function scoreColor(percentage: number): string {
  if (percentage >= 80) return "teal";
  if (percentage >= 60) return "lime";
  if (percentage >= 40) return "yellow";
  if (percentage > 0) return "orange";
  return "red";
}

export function ResultsDashboard() {
  const { quizResult, quizData, reset } = useQuizStore();
  const [shareOpened, setShareOpened] = useState(false);

  if (!quizResult || !quizData) {
    return <Text>No results available.</Text>;
  }

  const color = scoreColor(quizResult.percentage);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" maw={720} mx="auto">
        <Stack gap="lg">
          <Stack align="center" gap={0}>
            <Title order={2}>{quizData.quizTitle}</Title>
            <Text size="sm" c="dimmed">
              {quizResult.score}/{quizResult.total} points
            </Text>
          </Stack>

          <Center>
            <RingProgress
              size={180}
              thickness={16}
              roundCaps
              sections={[{ value: quizResult.percentage, color }]}
              label={
                <Stack align="center" gap={0}>
                  <Text fw={900} size="44" c={color}>
                    {quizResult.percentage}%
                  </Text>
                  <Text size="sm" c="dimmed">
                    {scoreLabel(quizResult.percentage)}
                  </Text>
                </Stack>
              }
            />
          </Center>

          <Title order={4}>Review</Title>

          <Accordion>
            {quizResult.questionResults.map((result, i) => (
              <Accordion.Item key={result.question.id} value={result.question.id}>
                <Accordion.Control>
                  <Group gap="sm">
                    <ThemeIcon color={result.isCorrect ? "green" : "red"} size={24} radius="xl">
                      {result.isCorrect ? <IconCheck size={14} /> : <IconX size={14} />}
                    </ThemeIcon>
                    <Text fw={500} style={{ flex: 1 }} lineClamp={1}>
                      {i + 1}. {result.question.questionText}
                    </Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs">
                    <Text size="sm">
                      <Text span fw={500}>
                        Your answer:
                      </Text>{" "}
                      <Text span c={result.isCorrect ? "green" : "red"}>
                        {displayAnswer(result.userAnswer) || "(no answer)"}
                      </Text>
                    </Text>
                    {!result.isCorrect && (
                      <Text size="sm">
                        <Text span fw={500}>
                          Correct answer:
                        </Text>{" "}
                        <Text span c="green">
                          {displayAnswer(result.question.correctAnswer)}
                        </Text>
                      </Text>
                    )}
                    {result.question.explanation && (
                      <Paper p="sm" withBorder bg="var(--mantine-color-blue-0)">
                        <Text size="sm">
                          <Text span fw={500}>
                            Explanation:
                          </Text>{" "}
                          {result.question.explanation}
                        </Text>
                      </Paper>
                    )}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

          <Group justify="center" mt="md">
            <Button
              variant="light"
              leftSection={<IconShare size={16} />}
              onClick={() => setShareOpened(true)}
            >
              Share Quiz
            </Button>
            <Button variant="outline" onClick={reset}>
              Back to Home
            </Button>
          </Group>
        </Stack>
      </Card>

      {quizData && (
        <ShareModal
          opened={shareOpened}
          onClose={() => setShareOpened(false)}
          quizData={quizData}
        />
      )}
    </>
  );
}
