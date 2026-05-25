# Run the Quiz

A "zero-backend" AI quiz runner. Generate a quiz prompt for any AI, paste the resulting JSON, and play — no server required.

## Features

- **Prompt Generator** — Form-based UI to build a structured prompt with topic, difficulty, question types, and an injected JSON schema. Collapsible to save space.
- **JSON Ingestion** — Paste AI-generated JSON with built-in validation. Click **Load Demo Quiz** to try the app instantly without AI.
- **Quiz Runner** — Timer, shuffle, dynamic inputs (Radio, Checkbox, TextInput), progress bar, must-answer enforcement, auto-submit on timeout.
- **Results Dashboard** — Visual score ring, per-question review with all answers expanded by default, color-coded correct/incorrect with explanations.

## Stack

- React 19, TypeScript, Vite+ (Rolldown)
- Mantine UI v7, Tabler Icons
- Zustand (state management)
- PWA via vite-plugin-pwa (auto-update, precache)

## Usage

### 1. Generate a Quiz Prompt

1. Open the **AI Prompt Generator** section.
2. Enter a topic (e.g., "Solar system for 5th graders").
3. Set number of questions, difficulty, and question types.
4. Copy the generated prompt and send it to any AI (ChatGPT, Claude, Gemini, etc.).
5. The AI will return a JSON object.

### 2. Paste the JSON

1. Copy the AI's JSON response.
2. Paste it into the **Paste Quiz JSON** textarea.
3. Validation runs automatically — errors show inline.
4. Toggle **Shuffle Questions** and **Time Limit** as desired.
5. Click **Start Quiz**.

Alternatively, click **Load Demo Quiz** to skip AI generation and test with sample data.

### 3. Take the Quiz

- Answer each question to advance. The **Next** button is disabled until you answer.
- The progress bar shows your position. A timer counts down if enabled.
- Review and change previous answers using **Prev**/**Next**.
- Submit on the last question or when time runs out.

### 4. Review Results

- See your score as a percentage with a color-coded ring.
- Every question is shown expanded by default — green check for correct, red X for incorrect.
- Wrong answers show the correct answer alongside. Explanations appear where provided.
- Click **Back to Home** to start a new quiz.

## Quick Start

```bash
vp install    # install dependencies
vp dev        # start dev server
vp build      # production build
vp check      # lint + format + typecheck
vp preview    # preview production build
```
