import { Container, Title, Text, Stack } from "@mantine/core";
import { useQuizStore } from "./store/quizStore";
import { PromptGenerator } from "./components/PromptGenerator";
import { JsonIngestion } from "./components/JsonIngestion";
import { QuizRunner } from "./components/QuizRunner";
import { ResultsDashboard } from "./components/ResultsDashboard";

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
