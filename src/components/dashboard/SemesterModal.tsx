import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  CreditCard,
  FileText,
  Zap,
  Plus,
  Download,
  AlertCircle,
  Trash2,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

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

interface SemesterResult {
  subject: string;
  code: string;
  grade: string;
  marks: number;
  credits: number;
  attendance: number;
}

const AVAILABLE_SUBJECTS = [
  "PHYS-301: Quantum Mechanics",
  "PHYS-402: Advanced Thermodynamics",
  "CS-402: Ethics in AI",
  "PHYS-305L: Computational Physics Lab",
];

const MOCK_SEMESTER_RESULTS: SemesterResult[] = [
  {
    subject: "Quantum Mechanics",
    code: "PHYS-301",
    grade: "A+",
    marks: 92,
    credits: 4,
    attendance: 94,
  },
  {
    subject: "Advanced Thermodynamics",
    code: "PHYS-402",
    grade: "A",
    marks: 88,
    credits: 4,
    attendance: 90,
  },
  {
    subject: "Ethics in AI",
    code: "CS-402",
    grade: "A+",
    marks: 95,
    credits: 3,
    attendance: 96,
  },
  {
    subject: "Computational Physics Lab",
    code: "PHYS-305L",
    grade: "A",
    marks: 85,
    credits: 2,
    attendance: 100,
  },
];

export default function SemesterModal() {
  const [activeTab, setActiveTab] = useState<
    "results" | "formfillup" | "payment" | "pyq"
  >("results");
  const [isOpen, setIsOpen] = useState(false);
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
  const [paymentAmount, setPaymentAmount] = useState(45000);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    "PHYS-301",
    "PHYS-402",
    "CS-402",
    "PHYS-305L",
  ]);

  const totalCredits = MOCK_SEMESTER_RESULTS.reduce((sum, r) => sum + r.credits, 0);
  const totalMarksSum = MOCK_SEMESTER_RESULTS.reduce((sum, r) => sum + r.marks, 0);
  const cgpa = (totalMarksSum / (MOCK_SEMESTER_RESULTS.length * 100)) * 4;
  const avgAttendance =
    MOCK_SEMESTER_RESULTS.reduce((sum, r) => sum + r.attendance, 0) /
    MOCK_SEMESTER_RESULTS.length;

  const handleGenerateExam = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    const totalQuestionsCount = distribution.reduce((sum, d) => sum + d.count, 0);
    const calculatedMarks = distribution.reduce(
      (sum, d) => sum + d.marks * d.count,
      0
    );

    if (calculatedMarks !== totalMarks) {
      toast.error(
        `Distribution doesn't match total marks. Selected: ${calculatedMarks}, Required: ${totalMarks}`
      );
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

  const handlePayment = () => {
    toast.success("Payment processed successfully! Transaction ID: TXN123456");
    toast.info("Invoice will be sent to your email shortly.");
  };

  const handleToggleCourse = (code: string) => {
    setSelectedCourses((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const tabs = [
    {
      id: "results" as const,
      label: "Semester Results",
      icon: BarChart3,
    },
    {
      id: "formfillup" as const,
      label: "Form Fillup",
      icon: FileText,
    },
    {
      id: "payment" as const,
      label: "Fee Payment",
      icon: CreditCard,
    },
    {
      id: "pyq" as const,
      label: "PYQ Mock Exams",
      icon: Zap,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground h-12 px-8 text-base font-semibold">
          Semester
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Semester Dashboard</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-4">
          {/* Semester Results */}
          {activeTab === "results" && (
            <div className="space-y-6 py-4">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">
                    CGPA
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{cgpa.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">/4.0</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">
                    Credits
                  </p>
                  <p className="text-2xl font-bold text-green-600">{totalCredits}</p>
                  <p className="text-xs text-muted-foreground mt-1">Earned</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">
                    Avg Marks
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(totalMarksSum / MOCK_SEMESTER_RESULTS.length).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">/100</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200/50">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">
                    Attendance
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {avgAttendance.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Average</p>
                </Card>
              </div>

              <Separator />

              {/* Detailed Results */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Subject-wise Performance</h3>
                <div className="space-y-3">
                  {MOCK_SEMESTER_RESULTS.map((result, idx) => (
                    <motion.div
                      key={result.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">{result.subject}</p>
                            <p className="text-xs text-muted-foreground">{result.code}</p>
                          </div>
                          <Badge
                            className={`text-white ${
                              result.grade === "A+"
                                ? "bg-green-600"
                                : result.grade === "A"
                                ? "bg-emerald-600"
                                : "bg-blue-600"
                            }`}
                          >
                            {result.grade}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Marks</p>
                            <p className="font-bold text-lg">{result.marks}/100</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Credits</p>
                            <p className="font-bold text-lg">{result.credits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Attendance
                            </p>
                            <p className="font-bold text-lg">{result.attendance}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Grade Points
                            </p>
                            <p className="font-bold text-lg">
                              {result.credits * (result.grade === "A+" ? 4 : 3.7)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              result.marks >= 90
                                ? "bg-green-600"
                                : result.marks >= 80
                                ? "bg-blue-600"
                                : "bg-yellow-600"
                            }`}
                            style={{ width: `${result.marks}%` }}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Fillup */}
          {activeTab === "formfillup" && (
            <div className="space-y-6 py-4">
              <Card className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Course Registration Form
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select the courses you want to register for this semester:
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { code: "PHYS-301", name: "Quantum Mechanics" },
                    { code: "PHYS-402", name: "Advanced Thermodynamics" },
                    { code: "CS-402", name: "Ethics in AI" },
                    { code: "PHYS-305L", name: "Computational Physics Lab" },
                  ].map((course) => (
                    <div key={course.code} className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded-lg border">
                      <Checkbox
                        checked={selectedCourses.includes(course.code)}
                        onCheckedChange={() => handleToggleCourse(course.code)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.code}</p>
                      </div>
                      <Badge variant="outline">4 Credits</Badge>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Additional Comments
                    </Label>
                    <textarea
                      placeholder="Add any special requests or comments..."
                      className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>

                  <Button className="w-full rounded-lg" size="lg">
                    Submit Form
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Fee Payment */}
          {activeTab === "payment" && (
            <div className="space-y-6 py-4">
              <Card className="p-6 bg-green-50/50 dark:bg-green-950/20 border-green-200/50">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Semester Fee Payment
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-white dark:bg-background rounded-lg border">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Tuition Fee</span>
                      <span className="font-semibold">₹40,000</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Registration Fee
                      </span>
                      <span className="font-semibold">₹2,500</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Lab Fee</span>
                      <span className="font-semibold">₹2,500</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between">
                      <span className="font-bold">Total Amount Due</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{paymentAmount}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-semibold">Due Date:</span> May 31, 2026
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Penalty:</span> Late submissions
                      attract 2% per day interest
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full rounded-lg h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                >
                  Pay ₹{paymentAmount} with Razorpay
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your payment information is encrypted and secure
                </p>
              </Card>
            </div>
          )}

          {/* PYQ Mock Exams */}
          {activeTab === "pyq" && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Generate Mock Exams</h3>
              </div>

              {/* Add Exam Button */}
              <button
                onClick={() => setIsGenerating(!isGenerating)}
                className="w-full p-4 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors text-center"
              >
                <Plus className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Generate New Mock Exam</p>
              </button>

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-4 bg-muted/30 rounded-lg"
                >
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Select Subject
                    </Label>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {AVAILABLE_SUBJECTS.map((subject) => (
                        <div
                          key={subject}
                          onClick={() => setSelectedSubject(subject)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
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

                  <div>
                    <Label className="text-base font-semibold mb-2 block">
                      Total Marks
                    </Label>
                    <Input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(parseInt(e.target.value) || 0)}
                      placeholder="100"
                      className="h-10"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block flex justify-between">
                      <span>Question Distribution</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Total: {distribution.reduce((sum, d) => sum + d.marks * d.count, 0)} marks
                      </span>
                    </Label>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {distribution.map((dist, idx) => (
                        <div key={idx} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label className="text-xs mb-1 block">Marks</Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs mb-1 block">Count</Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="text-sm font-semibold text-primary min-w-[40px]">
                            {dist.marks * dist.count}
                          </div>
                          {distribution.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveDistribution(idx)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddDistribution}
                      className="mt-2 w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Distribution
                    </Button>
                  </div>

                  <Button
                    onClick={handleGenerateExam}
                    className="w-full rounded-lg"
                  >
                    Generate Mock Exam
                  </Button>
                </motion.div>
              )}

              {/* Generated Exams */}
              <div className="space-y-3">
                {generatedExams.length === 0 ? (
                  <div className="p-8 text-center border border-dashed rounded-lg">
                    <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No mock exams generated yet
                    </p>
                  </div>
                ) : (
                  generatedExams.map((exam) => (
                    <Card key={exam.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-sm">{exam.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {exam.generatedDate}
                          </p>
                        </div>
                        <Badge>{exam.totalMarks} Marks</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                        {exam.distribution.map((d, i) => (
                          <div
                            key={i}
                            className="p-2 bg-muted/50 rounded text-center"
                          >
                            {d.count} × {d.marks}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                          Start Exam
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExam(exam.id)}
                          className="text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
