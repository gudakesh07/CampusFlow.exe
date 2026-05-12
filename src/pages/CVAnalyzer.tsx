import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  FileText,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { toast } from "sonner";
import { analyzeCVWithAI } from "@/services/aiService";
import { useNavigate } from "react-router-dom";

type AnalysisResult = {
  shortcomings: string[];
  improvements: string[];
  strengths: string[];
  overallScore: number;
  detailedAnalysis: string;
};

export default function CVAnalyzer() {
  const [cvText, setCvText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    console.log("File selected:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    try {
      const text = await extractTextFromFile(file);
      setCvText(text);
      toast.success("CV loaded successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("File read error:", errorMessage);
      toast.error(errorMessage || "Failed to read CV file. Please try again.");
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
      // For PDF, send to backend for extraction
      const formData = new FormData();
      formData.append("pdf", file);

      try {
        console.log("Sending PDF to backend for extraction...");
        const response = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        });

        console.log("PDF extraction response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.statusText}`,
          );
        }

        const data = await response.json();
        if (!data.text) {
          throw new Error("No text extracted from PDF");
        }
        console.log("PDF extracted successfully, text length:", data.text.length);
        return data.text;
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : String(error);
        console.error("PDF extraction failed:", msg);
        throw new Error(`PDF extraction failed: ${msg}`);
      }
    } else if (fileName.endsWith(".txt") || file.type === "text/plain") {
      // For text files
      try {
        console.log("Reading text file...");
        const text = await file.text();
        console.log("Text file read successfully, length:", text.length);
        if (!text.trim()) {
          throw new Error("Text file is empty");
        }
        return text;
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : String(error);
        console.error("Text file read failed:", msg);
        throw new Error(`Failed to read text file: ${msg}`);
      }
    } else {
      // Unsupported file type
      throw new Error(
        `Unsupported file type. Please use PDF or TXT format.`,
      );
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      toast.error("Please upload a CV first!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeCVWithAI(cvText);
      setAnalysis(result);
      toast.success("CV analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze CV. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCvText("");
    setAnalysis(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/dashboard/student")}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              AI CV Analyzer
            </h1>
            <p className="text-muted-foreground font-light mt-2">
              Upload your CV and get AI-powered feedback on improvements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  Upload CV
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Supported formats: PDF, TXT
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl mb-3"
                >
                  <Upload className="w-4 h-4 mr-2" /> Choose File
                </Button>

                {fileName && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs font-medium truncate flex items-center gap-2 justify-center">
                      <FileText className="w-4 h-4" /> {fileName}
                    </p>
                  </div>
                )}

                {cvText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl"
                  >
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-4 h-4" /> CV Ready
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={!cvText || isLoading}
                  className="w-full mt-6 rounded-xl bg-primary"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Analyze CV
                    </>
                  )}
                </Button>

                {analysis && (
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="w-full mt-3 rounded-xl"
                  >
                    Clear & Retry
                  </Button>
                )}
              </div>
            </Card>

            {/* Stats Card */}
            {analysis && (
              <Card className="p-6 rounded-3xl mt-6">
                <h3 className="font-display font-semibold mb-4">
                  Overall Score
                </h3>
                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-display font-bold text-primary">
                      {analysis.overallScore}
                    </span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${analysis.overallScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {analysis.overallScore >= 80
                    ? "Excellent! Your CV is well-structured."
                    : analysis.overallScore >= 60
                      ? "Good! There's room for improvement."
                      : "There are several areas to improve."}
                </p>
              </Card>
            )}
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {analysis ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <Card className="p-6 rounded-3xl border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" /> Strengths
                    </h3>
                    <ul className="space-y-3">
                      {analysis.strengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Shortcomings */}
                {analysis.shortcomings.length > 0 && (
                  <Card className="p-6 rounded-3xl border-amber-200 dark:border-amber-800">
                    <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-5 h-5" /> Areas of Improvement
                    </h3>
                    <ul className="space-y-3">
                      {analysis.shortcomings.map((shortcoming, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{shortcoming}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Improvement Suggestions */}
                {analysis.improvements.length > 0 && (
                  <Card className="p-6 rounded-3xl border-blue-200 dark:border-blue-800">
                    <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Sparkles className="w-5 h-5" /> Improvement Tips
                    </h3>
                    <ul className="space-y-3">
                      {analysis.improvements.map((improvement, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl"
                        >
                          <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                            {idx + 1}.
                          </span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Detailed Analysis */}
                <Card className="p-6 rounded-3xl">
                  <h3 className="font-display font-semibold text-lg mb-4">
                    Detailed Analysis
                  </h3>
                  <ScrollArea className="h-96 pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                      <ReactMarkdown>{analysis.detailedAnalysis}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-12 rounded-3xl flex items-center justify-center h-full min-h-96 bg-muted/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary opacity-50" />
                  </div>
                  <p className="text-muted-foreground">
                    Upload your CV to get started
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
