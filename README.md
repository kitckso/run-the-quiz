# Run the Quiz

A "zero-backend" AI quiz runner. Generate a quiz prompt for any AI, paste the resulting JSON, and play — no server required.

## Features

- **Prompt Generator** — Form-based UI to build a structured prompt with topic, difficulty, question types, and an injected JSON schema.
- **JSON Ingestion** — Paste AI-generated JSON with built-in validation.
- **Quiz Runner** — Timer, shuffle, dynamic inputs (Radio, Checkbox, TextInput), progress bar, auto-submit on timeout.
- **Results Dashboard** — Visual score ring, per-question review with explanations, color-coded correct/incorrect answers.
- **Zero-Backend Sharing** — Upload quiz data to file.io, share via short URL with QR code.

## Stack

- React 19, TypeScript, Vite+ (Rolldown)
- Mantine UI v7, Tabler Icons
- Zustand (state), qrcode.react, file.io (share)
- PWA via vite-plugin-pwa (auto-update, precache)

## Usage

```bash
vp dev       # start dev server
vp build     # production build
vp check     # lint + format + typecheck
vp preview   # preview production build
```
