import { useEffect } from "react";
import { Container, Title, Text, Stack } from "@mantine/core";
import { useQuizStore } from "./store/quizStore";
import { PromptGenerator } from "./components/PromptGenerator";
import { JsonIngestion } from "./components/JsonIngestion";
import { QuizRunner } from "./components/QuizRunner";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { downloadQuizJson } from "./lib/fileio";
import type { QuizData } from "./types/quiz";

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
    </Stack>
  );
}

function App() {
  const screen = useQuizStore((s) => s.screen);
  const setQuizData = useQuizStore((s) => s.setQuizData);
  const setPrefilledJson = useQuizStore((s) => s.setPrefilledJson);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const idMatch = hash.match(/[?&]id=([^&]+)/);
    if (!idMatch) return;

    const key = idMatch[1];

    downloadQuizJson(key)
      .then((jsonString) => {
        const data = JSON.parse(jsonString) as QuizData;
        if (data.quizTitle && Array.isArray(data.questions)) {
          setPrefilledJson(jsonString);
          setQuizData(data);
        }
      })
      .catch(() => {
        // Failed to load, stay on home
      });
  }, [setPrefilledJson, setQuizData]);

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
      {renderScreen()}
    </Container>
  );
}

export default App;
