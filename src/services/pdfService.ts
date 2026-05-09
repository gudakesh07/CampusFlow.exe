export async function extractTextFromPDF(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await fetch("/api/extract-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to extract PDF text");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("PDF Service Error:", error);
    throw error;
  }
}
