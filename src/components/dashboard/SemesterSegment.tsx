import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart3,
  FileText,
  CreditCard,
  Zap,
  Plus,
  Download,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";

interface QuestionDistribution {
  marks: number;
  count: number;
}

interface GeneratedExam {
  id: string;
  subject: string;
  totalMarks: number;
  totalQuestions: number;
  distribution: QuestionDistribution[];
  generatedDate: string;
}

const AVAILABLE_SUBJECTS = [
  "PHYS-301: Quantum Mechanics",
  "PHYS-402: Advanced Thermodynamics",
  "CS-402: Ethics in AI",
  "PHYS-305L: Computational Physics Lab",
];

const SEMESTER_ITEMS = [
  {
    icon: BarChart3,
    label: "Semester Results",
    description: "View your academic performance",
    status: "CGPA: 8.5",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    label: "Form Fillup",
    description: "Complete course registration forms",
    status: "Pending",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CreditCard,
    label: "Fee Payment",
    description: "Manage semester fees",
    status: "₹45,000",
    color: "from-green-500 to-emerald-500",
  },
];

export default function SemesterSegment() {
  const [generatedExams, setGeneratedExams] = useState<GeneratedExam[]>([
    {
      id: "1",
      subject: "PHYS-301: Quantum Mechanics",
      totalMarks: 100,
      totalQuestions: 27,
      distribution: [
        { marks: 1, count: 20 },
        { marks: 2, count: 5 },
        { marks: 4, count: 2 },
      ],
      generatedDate: "2026-05-10",
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [distribution, setDistribution] = useState<QuestionDistribution[]>([
    { marks: 1, count: 50 },
    { marks: 2, count: 25 },
    { marks: 5, count: 10 },
  ]);

  const handleGenerateExam = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    const totalQuestionsCount = distribution.reduce((sum, d) => sum + d.count, 0);
    const calculatedMarks = distribution.reduce((sum, d) => sum + d.marks * d.count, 0);

    if (calculatedMarks !== totalMarks) {
      toast.error(
        `Distribution doesn't match total marks. Selected: ${calculatedMarks}, Required: ${totalMarks}`
      );
      return;
    }

    if (totalQuestionsCount === 0) {
      toast.error("Add at least one question to the distribution");
      return;
    }

    const newExam: GeneratedExam = {
      id: Date.now().toString(),
      subject: selectedSubject,
      totalMarks: totalMarks,
      totalQuestions: totalQuestionsCount,
      distribution: distribution,
      generatedDate: new Date().toISOString().split("T")[0],
    };

    setGeneratedExams([newExam, ...generatedExams]);
    setSelectedSubject("");
    setTotalMarks(100);
    setDistribution([
      { marks: 1, count: 50 },
      { marks: 2, count: 25 },
      { marks: 5, count: 10 },
    ]);
    setIsGenerating(false);
    toast.success("Mock exam generated successfully!");
  };

  const handleDeleteExam = (id: string) => {
    setGeneratedExams(generatedExams.filter((exam) => exam.id !== id));
    toast.success("Mock exam removed");
  };

  const handleUpdateDistribution = (
    index: number,
    field: "marks" | "count",
    value: number
  ) => {
    const updated = [...distribution];
    updated[index] = { ...updated[index], [field]: value };
    setDistribution(updated);
  };

  const handleAddDistribution = () => {
    setDistribution([...distribution, { marks: 1, count: 10 }]);
  };

  const handleRemoveDistribution = (index: number) => {
    if (distribution.length > 1) {
      setDistribution(distribution.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8">
      {/* Semester Items Cards */}
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight mb-6">
          📚 Semester Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEMESTER_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-6 bg-gradient-to-br ${item.color} text-white rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all`}>
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  <Icon className="w-8 h-8 mb-4 opacity-90" />
                  <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
                  <p className="text-xs opacity-90 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-75">{item.status}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-lg text-xs"
                    >
                      View
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* PYQ Mock Exam Generator */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" /> PYQ Mock Exams
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Generate custom mock exams from previous year questions
            </p>
          </div>
          <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground flex items-center gap-2 h-11 px-6">
                <Plus className="w-4 h-4" />
                Generate Mock Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate Custom Mock Exam</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Subject Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Select Subject
                  </Label>
                  <div className="space-y-2">
                    {AVAILABLE_SUBJECTS.map((subject) => (
                      <div
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedSubject === subject
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{subject}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Marks */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Total Marks for Test
                  </Label>
                  <Input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(parseInt(e.target.value) || 0)}
                    placeholder="100"
                    className="text-lg h-11"
                  />
                </div>

                {/* Question Distribution */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-base font-semibold">
                      Question Distribution
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      Total: {distribution.reduce((sum, d) => sum + d.marks * d.count, 0)} marks
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {distribution.map((dist, idx) => (
                      <div key={idx} className="flex gap-3 items-end p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <Label className="text-xs mb-1 block">Marks per Q</Label>
                          <Input
                            type="number"
                            min="1"
                            value={dist.marks}
                            onChange={(e) =>
                              handleUpdateDistribution(
                                idx,
                                "marks",
                                parseInt(e.target.value) || 1
                              )
                            }
                            placeholder="1"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs mb-1 block">No. of Qs</Label>
                          <Input
                            type="number"
                            min="0"
                            value={dist.count}
                            onChange={(e) =>
                              handleUpdateDistribution(
                                idx,
                                "count",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="50"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {dist.marks * dist.count}
                        </div>
                        {distribution.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDistribution(idx)}
                            className="h-9 w-9"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddDistribution}
                    className="mt-3 w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Distribution
                  </Button>
                </div>

                <Separator />

                <Button
                  onClick={handleGenerateExam}
                  className="w-full h-12 text-base"
                >
                  Generate Mock Exam
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Generated Exams List */}
        <div className="space-y-4">
          {generatedExams.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No mock exams generated yet. Create one to get started!
              </p>
            </Card>
          ) : (
            generatedExams.map((exam, idx) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exam.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generated on {exam.generatedDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary/20 text-primary">
                        {exam.totalMarks} Marks
                      </Badge>
                    </div>
                  </div>

                  {/* Distribution Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                    {exam.distribution.map((dist, i) => (
                      <div key={i} className="text-center">
                        <p className="text-sm font-semibold text-primary">
                          {dist.count} × {dist.marks}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dist.count} questions of {dist.marks} marks
                        </p>
                      </div>
                    ))}
                    <div className="text-center border-l">
                      <p className="text-sm font-semibold text-foreground">
                        {exam.totalQuestions}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Questions
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 rounded-lg" variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Start Exam
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExam(exam.id)}
                      className="rounded-lg text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
