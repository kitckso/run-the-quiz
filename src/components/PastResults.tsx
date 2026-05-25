import { useState } from "react";
import { Modal, Stack, Text, Button, Group, Paper, ThemeIcon } from "@mantine/core";
import { IconHistory, IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { useQuizStore } from "../store/quizStore";
import { loadHistory, deleteHistoryEntry } from "../lib/storage";
import type { SavedResult } from "../lib/storage";

export function PastResults() {
  const [opened, setOpened] = useState(false);
  const [list, setList] = useState<SavedResult[]>([]);
  const loadSavedResult = useQuizStore((s) => s.loadSavedResult);

  const open = () => {
    setList(loadHistory());
    setOpened(true);
  };

  return (
    <>
      <Button variant="subtle" leftSection={<IconHistory size={18} />} onClick={open} size="sm">
        Past Results
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Past Results" size="md">
        <Stack gap="sm">
          {list.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" py="xl">
              No past results yet.
            </Text>
          )}
          {list.map((entry: SavedResult) => (
            <Paper
              key={entry.id}
              p="sm"
              withBorder
              style={{ cursor: "pointer" }}
              onClick={() => {
                loadSavedResult(entry);
                setOpened(false);
              }}
            >
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon color={entry.percentage >= 60 ? "green" : "red"} size={32} radius="xl">
                  {entry.percentage >= 60 ? <IconCheck size={16} /> : <IconX size={16} />}
                </ThemeIcon>
                <Stack gap={0} style={{ flex: 1, overflow: "hidden" }}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {entry.quizTitle}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {entry.date} — {entry.score}/{entry.total} ({entry.percentage}%)
                  </Text>
                </Stack>
                <Button
                  variant="subtle"
                  color="red"
                  size="compact-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHistoryEntry(entry.id);
                    setList((prev) => prev.filter((r) => r.id !== entry.id));
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
