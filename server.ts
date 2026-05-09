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
