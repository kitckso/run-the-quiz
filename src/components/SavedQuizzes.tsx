import { useState } from "react";
import { Modal, Stack, Text, Button, Group, Paper } from "@mantine/core";
import { IconBooks, IconTrash } from "@tabler/icons-react";
import { useQuizStore } from "../store/quizStore";
import { loadSavedQuizzes } from "../lib/storage";
import type { SavedQuiz } from "../lib/storage";

export function SavedQuizzes() {
  const [opened, setOpened] = useState(false);
  const [list, setList] = useState<SavedQuiz[]>([]);
  const setPrefilledJson = useQuizStore((s) => s.setPrefilledJson);

  const open = () => {
    setList(loadSavedQuizzes());
    setOpened(true);
  };

  return (
    <>
      <Button variant="subtle" leftSection={<IconBooks size={18} />} onClick={open} size="sm">
        Saved Quizzes
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Saved Quizzes" size="md">
        <Stack gap="sm">
          {list.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" py="xl">
              No saved quizzes yet.
            </Text>
          )}
          {list.map((entry: SavedQuiz) => (
            <Paper
              key={entry.id}
              p="sm"
              withBorder
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPrefilledJson(entry.json);
                setOpened(false);
              }}
            >
              <Group gap="sm" wrap="nowrap">
                <Stack gap={0} style={{ flex: 1, overflow: "hidden" }}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {entry.quizTitle}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {entry.date} — {entry.questionCount} question
                    {entry.questionCount !== 1 ? "s" : ""}
                  </Text>
                </Stack>
                <Button
                  variant="subtle"
                  color="red"
                  size="compact-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const stored = localStorage.getItem("run-the-quiz-saved");
                    if (stored) {
                      const parsed: SavedQuiz[] = JSON.parse(stored);
                      const filtered = parsed.filter((q) => q.id !== entry.id);
                      localStorage.setItem("run-the-quiz-saved", JSON.stringify(filtered));
                      setList(filtered);
                    }
                  }}
                >
                  <IconTrash size={14} />
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Modal>
    </>
  );
}
