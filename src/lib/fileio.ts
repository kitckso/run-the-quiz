const FILEIO_URL = "https://file.io";

export async function uploadQuizJson(jsonString: string): Promise<string> {
  const blob = new Blob([jsonString], { type: "application/json" });
  const file = new File([blob], "quiz.json", { type: "application/json" });
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(FILEIO_URL, { method: "POST", body: form });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }

  const data = await res.json();
  if (!data.success || !data.key) {
    throw new Error("Upload response missing key");
  }

  return data.key as string;
}

export async function downloadQuizJson(key: string): Promise<string> {
  const res = await fetch(`${FILEIO_URL}/${key}`);

  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }

  return res.text();
}
