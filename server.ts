import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import multer from "multer";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { gunzip } from "zlib";
import { promisify } from "util";

const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");
const pdfParse = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gunzipAsync = promisify(gunzip);

export const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.text({ limit: "50mb" }));

// Multer for file uploads - increased limit for large PDFs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Try pdf-parse first (more reliable for most PDFs)
    console.log("Attempting extraction with pdf-parse...");
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (text && text.trim().length > 0) {
      console.log("Successfully extracted text from PDF using pdf-parse");
      return text;
    }
  } catch (error) {
    console.log("pdf-parse extraction failed, attempting fallback with pdf2json...");
  }

  // Fallback to pdf2json if pdf-parse fails
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(`PDF parsing error: ${errData.parserError}`));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const text = pdfParser.getRawTextContent();
        if (text && text.trim().length > 0) {
          console.log("Successfully extracted text from PDF using pdf2json");
          resolve(text);
        } else {
          reject(
            new Error(
              "No text extracted from PDF - it may be a scanned image-based PDF",
            ),
          );
        }
      } catch (error) {
        reject(
          new Error(
            `Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

// Helper function to handle both compressed and plain text responses
async function getResponseText(response: Response): Promise<string> {
  const buffer = await response.arrayBuffer();
  
  // Check if response is gzip-compressed (starts with magic bytes 1f 8b)
  if (buffer.byteLength > 2) {
    const view = new Uint8Array(buffer);
    if (view[0] === 0x1f && view[1] === 0x8b) {
      try {
        console.log("Detected gzip-compressed response, decompressing...");
        const decompressed = await gunzipAsync(Buffer.from(buffer));
        return decompressed.toString('utf-8');
      } catch (error) {
        console.error("Failed to decompress gzip response:", error);
      }
    }
  }
  
  // Return as plain text if not compressed
  return Buffer.from(buffer).toString('utf-8');
}

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
    const responseJsonText = await getResponseText(response);
    const data = JSON.parse(responseJsonText);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// PDF Text Extraction Endpoint
app.post("/api/extract-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!file.buffer || file.buffer.length === 0) {
      return res.status(400).json({ error: "File is empty" });
    }

    console.log("Extracting text from PDF:", file.originalname);
    const text = await extractTextFromPDF(file.buffer);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error:
          "No text could be extracted from the PDF. Please ensure it's a valid, text-based PDF.",
      });
    }

    res.json({ text });
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: `Failed to extract text from PDF: ${errorMessage}`,
    });
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
          "Accept-Encoding": "identity",
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
      const error = await getResponseText(response);
      console.error("Groq API Error:", error);
      return res
        .status(response.status)
        .json({ error: "Failed to get AI response" });
    }

    const responseJsonText = await getResponseText(response);
    const data = JSON.parse(responseJsonText);
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

// CV Analysis Endpoint
app.post("/api/analyze-cv", async (req, res) => {
  try {
    const { cvText } = req.body;

    if (!cvText || cvText.trim().length === 0) {
      return res.status(400).json({ error: "CV text is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "AI service not configured" });
    }

    const systemPrompt = `You are an expert CV/Resume analyst and career counselor. Your job is to analyze CVs and provide constructive, actionable feedback on how to improve them.

When analyzing a CV, you should:
1. Identify strengths and well-written sections
2. Point out specific shortcomings and areas that need improvement
3. Provide concrete, actionable suggestions for enhancement
4. Give an overall score from 0-100 based on structure, content, clarity, and professionalism

IMPORTANT: You MUST respond with ONLY a valid JSON object (no markdown code blocks, no extra text). Do not wrap it in triple backticks.
Use this exact structure:
{
  "strengths": ["strength 1", "strength 2"],
  "shortcomings": ["shortcoming 1", "shortcoming 2"],
  "improvements": ["improvement suggestion 1", "improvement suggestion 2"],
  "overallScore": 75,
  "detailedAnalysis": "Detailed analysis with line breaks represented as \\n. Make it comprehensive and in markdown format."
}

All strings must be properly escaped. Use \\n for line breaks in the detailedAnalysis field.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
          "Accept-Encoding": "identity",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Please analyze this CV:\n\n${cvText}` },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API Error:", error);
      return res
        .status(response.status)
        .json({ error: "Failed to analyze CV" });
    }

    let data;
    try {
      const text = await getResponseText(response);
      
      // Check if the response looks like valid JSON
      if (!text.trim().startsWith("{")) {
        console.error("Invalid response format. First 100 chars:", text.substring(0, 100));
        throw new Error("Response is not valid JSON");
      }
      
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse Groq response:", parseErr);
      return res.status(500).json({ 
        error: "Failed to parse API response. The API may be down or returning invalid data." 
      });
    }

    const responseText =
      data.choices?.[0]?.message?.content || "No response generated";

    try {
      // Extract JSON from markdown code blocks if present
      let jsonString = responseText;

      // Check if the response is wrapped in markdown code blocks
      const codeBlockMatch = responseText.match(
        /```(?:json)?\s*([\s\S]*?)\s*```/,
      );
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      }

      // Try to parse as JSON first
      let analysis;
      try {
        analysis = JSON.parse(jsonString);
      } catch (parseError) {
        // If parsing fails, try to fix common issues with newlines in strings
        // Replace unescaped newlines and carriage returns in the JSON string
        const fixedJsonString = jsonString
          .replace(/[\r\n]+/g, " ") // Replace newlines with spaces
          .replace(/  +/g, " "); // Replace multiple spaces with single space

        console.log("Attempting to parse fixed JSON...");
        analysis = JSON.parse(fixedJsonString);
      }

      res.json(analysis);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Original response text:", responseText);
      // Fallback response if parsing fails
      res.json({
        shortcomings: ["Unable to parse detailed analysis"],
        improvements: ["Please try again with a clearer CV"],
        strengths: [],
        overallScore: 50,
        detailedAnalysis: responseText,
      });
    }
  } catch (error) {
    console.error("CV Analysis Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({ error: "Failed to analyze CV" });
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
