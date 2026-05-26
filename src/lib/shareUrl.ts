import pako from "pako";
import type { QuizData } from "../types/quiz";

// ── Compress/decompress helpers using pako (deflate) + base64 ──

function compressToBase64(data: string): string {
  const compressed = pako.deflate(data, { level: 9 });
  let binary = "";
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return btoa(binary);
}

function decompressFromBase64(encoded: string): string | null {
  try {
    const binaryStr = atob(encoded);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return pako.inflate(bytes, { to: "string" });
  } catch {
    return null;
  }
}

// ── URL helpers ──

export function buildShareUrl(quizData: QuizData): string {
  const json = JSON.stringify(quizData);
  const compressed = compressToBase64(json);
  const base = window.location.origin + window.location.pathname.replace(/\/+$/, "");
  return `${base}#${compressed}`;
}

export function parseShareHash(): QuizData | null {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return null;
  try {
    const compressed = hash.slice(1);
    const decompressed = decompressFromBase64(compressed);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed) as QuizData;
    if (parsed.quizTitle && Array.isArray(parsed.questions)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
