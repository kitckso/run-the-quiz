import { useEffect, useState } from "react";
import { Container, Title, Text, Stack, Group, Alert } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";
import { useQuizStore } from "./store/quizStore";
import { PromptGenerator } from "./components/PromptGenerator";
import { JsonIngestion } from "./components/JsonIngestion";
import { QuizRunner } from "./components/QuizRunner";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { PastResults } from "./components/PastResults";
import { SavedQuizzes } from "./components/SavedQuizzes";
import { parseShareHash } from "./lib/shareUrl";

function HomeScreen() {
  return (
    <Stack gap="xl">
      <Stack align="center" gap="xs">
        <Title order={1}>Run the Quiz</Title>
        <Text c="dimmed" size="lg">
          Generate a quiz with AI, paste the JSON, and play — no backend required.
        </Text>
      </Stack>
      <PromptGenerator />
      <JsonIngestion />
      <Group justify="center">
        <SavedQuizzes />
        <PastResults />
      </Group>
    </Stack>
  );
}

function App() {
  const screen = useQuizStore((s) => s.screen);
  const setPrefilledJson = useQuizStore((s) => s.setPrefilledJson);
  const setPromptCollapsed = useQuizStore((s) => s.setPromptCollapsed);
  const [sharedQuizTitle, setSharedQuizTitle] = useState<string | null>(null);

  useEffect(() => {
    const quizData = parseShareHash();
    if (quizData) {
      setPrefilledJson(JSON.stringify(quizData, null, 2));
      setPromptCollapsed(true);
      setSharedQuizTitle(quizData.quizTitle);
    }
  }, [setPrefilledJson, setPromptCollapsed]);

  const renderScreen = () => {
    switch (screen) {
      case "quiz":
        return <QuizRunner />;
      case "results":
        return <ResultsDashboard />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <Container size="md" py="xl">
      {sharedQuizTitle && (
        <Alert
          icon={<IconLink size={16} />}
          color="blue"
          withCloseButton
          onClose={() => setSharedQuizTitle(null)}
          mb="md"
        >
          <Text span fw={500}>
            Quiz shared with you:{" "}
          </Text>
          <Text span>{sharedQuizTitle}</Text>
          <Text size="sm" c="dimmed" mt={4}>
            The quiz JSON has been loaded below. Check the data and click "Start Quiz" to begin.
          </Text>
        </Alert>
      )}
      {renderScreen()}
    </Container>
  );
}

export default App;
