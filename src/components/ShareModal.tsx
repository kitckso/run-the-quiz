import { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  Text,
  Button,
  Group,
  CopyButton,
  ActionIcon,
  Tooltip,
  Loader,
  Alert,
} from "@mantine/core";
import { IconCopy, IconCheck, IconQrcode, IconAlertCircle } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { uploadQuizJson } from "../lib/fileio";
import type { QuizData } from "../types/quiz";

interface ShareModalProps {
  opened: boolean;
  onClose: () => void;
  quizData: QuizData;
}

type Status = "uploading" | "success" | "error";

export function ShareModal({ opened, onClose, quizData }: ShareModalProps) {
  const [status, setStatus] = useState<Status>("uploading");
  const [shareKey, setShareKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!opened) return;
    setStatus("uploading");
    setShareKey("");
    setError("");

    const jsonString = JSON.stringify(quizData);
    uploadQuizJson(jsonString)
      .then((key) => {
        setShareKey(key);
        setStatus("success");
      })
      .catch((err: Error) => {
        setError(err.message);
        setStatus("error");
      });
  }, [opened, quizData]);

  const shareUrl = shareKey
    ? `${window.location.origin}${window.location.pathname}#/quiz?id=${shareKey}`
    : "";

  return (
    <Modal opened={opened} onClose={onClose} title="Share Quiz" size="md">
      <Stack gap="md" align="center">
        {status === "uploading" && (
          <Stack align="center" py="xl" gap="md">
            <Loader size="lg" />
            <Text size="sm" c="dimmed">
              Uploading quiz data…
            </Text>
          </Stack>
        )}

        {status === "error" && (
          <Alert icon={<IconAlertCircle size={16} />} title="Upload Failed" color="red">
            {error}
          </Alert>
        )}

        {status === "success" && (
          <>
            <Text size="sm" c="dimmed">
              Share this quiz with others via the link or QR code below.
            </Text>

            <Group gap="xs" w="100%" wrap="nowrap">
              <Text
                size="xs"
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                  background: "var(--mantine-color-gray-0)",
                  padding: "8px 12px",
                  borderRadius: "var(--mantine-radius-sm)",
                }}
              >
                {shareUrl}
              </Text>
              <CopyButton value={shareUrl}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy URL"}>
                    <ActionIcon color={copied ? "teal" : "gray"} onClick={copy} size="lg">
                      {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>

            <Stack align="center" gap="xs">
              <IconQrcode size={24} style={{ color: "var(--mantine-color-dimmed)" }} />
              <QRCodeSVG value={shareUrl} size={200} />
              <Text size="xs" c="dimmed">
                Scan to open quiz on your phone
              </Text>
            </Stack>
          </>
        )}

        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </Stack>
    </Modal>
  );
}
