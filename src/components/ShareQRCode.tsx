import { Component, useRef, useState } from "react";
import { Modal, Stack, Text, Button, CopyButton, Paper } from "@mantine/core";
import { IconDownload, IconLink, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { QRCodeCanvas } from "qrcode.react";
import { buildShareUrl } from "../lib/shareUrl";
import type { QuizData } from "../types/quiz";
import type { ReactNode } from "react";

interface ShareQRCodeProps {
  opened: boolean;
  onClose: () => void;
  quizData: QuizData;
  title?: string;
}

// QR code version 40, error correction L can hold up to ~2953 bytes.
// The URL prefix takes ~50 chars, leaving ~2900 for the compressed data.
// pako compresses quiz JSON to ~5% of original, so even large quizzes fit easily.
const QR_MAX_URL_LENGTH = 2900;

// ── Error boundary ──

interface QrBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface QrBoundaryState {
  hasError: boolean;
}

class QrErrorBoundary extends Component<QrBoundaryProps, QrBoundaryState> {
  state: QrBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ── Component ──

export function ShareQRCode({ opened, onClose, quizData, title }: ShareQRCodeProps) {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [qrFallback, setQrFallback] = useState(false);
  const url = buildShareUrl(quizData);
  const isTooLarge = url.length > QR_MAX_URL_LENGTH;

  const handleDownload = () => {
    const canvas = canvasWrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${quizData.quizTitle.replace(/[^a-zA-Z0-9]/g, "_")}_qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const showQr = !isTooLarge && !qrFallback;
  const qrSize = 800;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title ?? "Share Quiz via QR Code"}
      size="lg"
      centered
    >
      <Stack align="center" gap="md">
        {showQr ? (
          <>
            <Text size="sm" c="dimmed" ta="center">
              Scan the QR code to open this quiz on another device.
            </Text>

            <div
              ref={canvasWrapperRef}
              style={{
                padding: 16,
                background: "#fff",
                borderRadius: 12,
                display: "flex",
                justifyContent: "center",
                maxWidth: "100%",
              }}
            >
              <QrErrorBoundary onError={() => setQrFallback(true)}>
                <QRCodeCanvas
                  value={url}
                  size={qrSize}
                  level="L"
                  includeMargin
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    imageRendering: "pixelated",
                  }}
                />
              </QrErrorBoundary>
            </div>

            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconDownload size={14} />}
              onClick={handleDownload}
            >
              Download PNG
            </Button>
          </>
        ) : (
          <Paper p="lg" withBorder ta="center" style={{ width: "100%" }}>
            <IconAlertTriangle size={40} color="var(--mantine-color-orange-6)" />
            <Text fw={500} mt="sm">
              Quiz too large for QR Code
            </Text>
            <Text size="sm" c="dimmed" mt={4}>
              This quiz contains too much data to fit in a QR code. Use the link below to share it
              instead.
            </Text>
          </Paper>
        )}

        <CopyButton value={url}>
          {({ copied, copy }) => (
            <Button
              variant="light"
              color={copied ? "teal" : "blue"}
              leftSection={copied ? <IconCheck size={16} /> : <IconLink size={16} />}
              onClick={copy}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          )}
        </CopyButton>
      </Stack>
    </Modal>
  );
}
