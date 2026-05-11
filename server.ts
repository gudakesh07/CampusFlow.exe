import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import multer from "multer";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get available models
app.get("/api/models", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// PDF Text Extraction Endpoint for RAG
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/extract-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const data = await pdf(file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

// AI Chat Endpoint
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt || !context) {
      return res.status(400).json({ error: "Missing prompt or context" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "AI service not configured" });
    }

    const systemPrompt = `You are CampusFlow.exe's Academic Assistant. 
You have access to the following academic context extracted from institutional PDFs and lecture notes:

--- CONTEXT START ---
${context}
--- CONTEXT END ---

Instructions:
1. ONLY use the provided context to answer the question.
2. If the answer is not in the context, politely say that you don't have that specific information in your academic database.
3. Explain concepts simply yet professionally.
4. Use markdown for formatting.
5. Do not hallucinate.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Groq API Error:", error);
      return res
        .status(response.status)
        .json({ error: "Failed to get AI response" });
    }

    const data = await response.json();
    const responseText =
      data.choices?.[0]?.message?.content || "No response generated";
    res.json({ response: responseText });
  } catch (error) {
    console.error("AI Chat Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the server if we're not running on Vercel
if (!process.env.VERCEL) {
  startServer();
}

export default app;
