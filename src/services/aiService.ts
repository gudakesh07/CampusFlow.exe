import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAcademicAssistant(prompt: string, context: string) {
  try {
    const fullPrompt = `
      You are CampusFlow.exe's Academic Assistant. 
      You have access to the following academic context extracted from institutional PDFs and lecture notes:
      
      --- CONTEXT START ---
      ${context}
      --- CONTEXT END ---
      
      User Question: ${prompt}
      
      Instructions:
      1. ONLY use the provided context to answer the question.
      2. If the answer is not in the context, politely say that you don't have that specific information in your academic database.
      3. Explain concepts simply yet professionally.
      4. Use markdown for formatting.
      5. Do not hallucinate.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // Using latest fast model
      contents: [{ parts: [{ text: fullPrompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    throw new Error("The Academic AI is currently recalibrating. Please try again soon.");
  }
}

export async function summarizeLectureNotes(context: string) {
  try {
    const prompt = `Summarize these lecture notes into key topics, important formulas (using LaTeX if needed), and a concise revision summary. Context: ${context}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("AI Summarization Error:", error);
    throw new Error("Failed to summarize notes.");
  }
}
