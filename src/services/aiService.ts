// Note: This service is now a wrapper around the backend /api/ai-chat endpoint which uses Groq.

export async function askAcademicAssistant(prompt: string, context: string) {
  const response = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get response");
  }

  const data = await response.json();
  return data.response;
}

export async function summarizeLectureNotes(context: string) {
  const prompt = `Summarize these lecture notes into key topics, important formulas (using LaTeX if needed), and a concise revision summary. Context: ${context}`;

  const response = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to summarize");
  }

  const data = await response.json();
  return data.response;
}
