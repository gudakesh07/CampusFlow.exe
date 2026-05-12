import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye, MoreVertical, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

interface MCQExam {
  id: string;
  name: string;
  course: string;
  questions: MCQQuestion[];
  totalPoints: number;
  status: "draft" | "published" | "closed";
  createdDate: string;
  startDate: string;
  endDate: string;
  duration: number; // in minutes
  totalAttempts: number;
}

const INITIAL_EXAMS: MCQExam[] = [
  {
    id: "1",
    name: "Quantum Mechanics Quiz 1",
    course: "PHYS-301",
    questions: [
      {
        id: "q1",
        question: "What is the Planck's constant approximately equal to?",
        options: [
          "6.626 × 10^-34 J·s",
          "3.14 × 10^-34 J·s",
          "9.8 × 10^-34 J·s",
          "2.71 × 10^-34 J·s",
        ],
        correctAnswer: 0,
        points: 1,
      },
    ],
    totalPoints: 1,
    status: "published",
    createdDate: "2026-10-01",
    startDate: "2026-10-10",
    endDate: "2026-10-15",
    duration: 30,
    totalAttempts: 38,
  },
  {
    id: "2",
    name: "Thermodynamics Midterm",
    course: "PHYS-402",
    questions: [],
    totalPoints: 0,
    status: "draft",
    createdDate: "2026-10-05",
    startDate: "2026-10-20",
    endDate: "2026-10-25",
    duration: 60,
    totalAttempts: 0,
  },
];

export default function FacultyMCQExamsPage() {
  const [exams, setExams] = useState<MCQExam[]>(INITIAL_EXAMS);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedExam, setSelectedExam] = useState<MCQExam | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [newExam, setNewExam] = useState({
    name: "",
    course: "",
    startDate: "",
    endDate: "",
    duration: 30,
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  });

  const handleCreateExam = () => {
    if (
      !newExam.name ||
      !newExam.course ||
      !newExam.startDate ||
      !newExam.endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const exam: MCQExam = {
      id: Date.now().toString(),
      ...newExam,
      questions: [],
      totalPoints: 0,
      status: "draft",
      createdDate: new Date().toISOString().split("T")[0],
      totalAttempts: 0,
    };

    setExams([exam, ...exams]);
    setNewExam({ name: "", course: "", startDate: "", endDate: "", duration: 30 });
    setIsCreating(false);
    toast.success("Exam created successfully");
  };

  const handleAddQuestion = () => {
    if (
      !newQuestion.question ||
      newQuestion.options.some((opt) => !opt.trim())
    ) {
      toast.error("Please fill in question and all options");
      return;
    }

    if (!selectedExam) return;

    const question: MCQQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      points: newQuestion.points,
    };

    const updatedExam = {
      ...selectedExam,
      questions: [...selectedExam.questions, question],
      totalPoints: selectedExam.totalPoints + newQuestion.points,
    };

    setExams(
      exams.map((exam) => (exam.id === selectedExam.id ? updatedExam : exam))
    );
    setSelectedExam(updatedExam);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    });
    setShowQuestionDialog(false);
    toast.success("Question added successfully");
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedExam) return;

    const question = selectedExam.questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedExam = {
      ...selectedExam,
      questions: selectedExam.questions.filter((q) => q.id !== questionId),
      totalPoints: Math.max(0, selectedExam.totalPoints - question.points),
    };

    setExams(
      exams.map((exam) => (exam.id === selectedExam.id ? updatedExam : exam))
    );
    setSelectedExam(updatedExam);
    toast.success("Question deleted");
  };

  const handlePublishExam = () => {
    if (!selectedExam) return;

    if (selectedExam.questions.length === 0) {
      toast.error("Add at least one question before publishing");
      return;
    }

    const updatedExam = { ...selectedExam, status: "published" as const };
    setExams(
      exams.map((exam) => (exam.id === selectedExam.id ? updatedExam : exam))
    );
    setSelectedExam(updatedExam);
    setIsEditing(false);
    toast.success("Exam published successfully");
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter((exam) => exam.id !== id));
    toast.success("Exam deleted");
  };

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
  };

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8 p-4 sm:p-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[2.5rem] p-8 border border-primary/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <h1 className="text-4xl font-display font-extrabold tracking-tight">
              MCQ Exams
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed font-medium">
              Create and manage multiple choice question exams for your students.
            </p>
          </div>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground flex items-center gap-2 relative z-10 h-12 px-6">
                <Plus className="w-4 h-4" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New MCQ Exam</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Exam Name</Label>
                  <Input
                    placeholder="e.g., Physics Midterm"
                    value={newExam.name}
                    onChange={(e) =>
                      setNewExam({ ...newExam, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Course Code</Label>
                  <Input
                    placeholder="e.g., PHYS-301"
                    value={newExam.course}
                    onChange={(e) =>
                      setNewExam({ ...newExam, course: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newExam.startDate}
                    onChange={(e) =>
                      setNewExam({ ...newExam, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newExam.endDate}
                    onChange={(e) =>
                      setNewExam({ ...newExam, endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newExam.duration}
                    onChange={(e) =>
                      setNewExam({ ...newExam, duration: parseInt(e.target.value) })
                    }
                  />
                </div>
                <Button
                  onClick={handleCreateExam}
                  className="w-full"
                >
                  Create Exam
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Exam Editor */}
        {selectedExam && isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Editing: {selectedExam.name}</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedExam(null);
                }}
              >
                Close Editor
              </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Questions ({selectedExam.questions.length})
                </h3>
                <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                  <DialogTrigger asChild>
                    <Button className="rounded-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add MCQ Question</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <div>
                        <Label>Question Text</Label>
                        <Input
                          placeholder="Enter question"
                          value={newQuestion.question}
                          onChange={(e) =>
                            setNewQuestion({ ...newQuestion, question: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newQuestion.points}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              points: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Options</Label>
                        {newQuestion.options.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Checkbox
                              checked={newQuestion.correctAnswer === idx}
                              onCheckedChange={() =>
                                setNewQuestion({ ...newQuestion, correctAnswer: idx })
                              }
                            />
                            <Input
                              placeholder={`Option ${idx + 1}`}
                              value={option}
                              onChange={(e) => {
                                const updated = [...newQuestion.options];
                                updated[idx] = e.target.value;
                                setNewQuestion({ ...newQuestion, options: updated });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <Button onClick={handleAddQuestion} className="w-full">
                        Add Question
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedExam.questions.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-lg">
                  <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No questions added yet</p>
                </div>
              ) : (
                selectedExam.questions.map((question, idx) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold">
                          Q{idx + 1}. {question.question}
                        </p>
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, optIdx) => (
                            <div key={optIdx} className="ml-4">
                              <p
                                className={
                                  optIdx === question.correctAnswer
                                    ? "text-green-700 dark:text-green-400 font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                {String.fromCharCode(65 + optIdx)}) {option}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Points: {question.points}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex gap-3">
              <Button
                onClick={handlePublishExam}
                className="bg-green-600 hover:bg-green-700"
              >
                Publish Exam
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedExam(null);
                }}
              >
                Save & Close
              </Button>
            </div>
          </motion.div>
        )}

        {/* Exams Grid */}
        {!isEditing && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{exam.name}</h3>
                        <p className="text-sm text-muted-foreground">{exam.course}</p>
                      </div>
                      <Badge className={statusColors[exam.status]}>
                        {exam.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Questions:</span>{" "}
                        {exam.questions.length}
                      </p>
                      <p>
                        <span className="font-medium">Total Points:</span>{" "}
                        {exam.totalPoints}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span> {exam.duration} min
                      </p>
                      <p>
                        <span className="font-medium">Attempts:</span>{" "}
                        {exam.totalAttempts}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Start: {exam.startDate}</p>
                      <p>End: {exam.endDate}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedExam(exam);
                        setIsEditing(true);
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteExam(exam.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {exams.length === 0 && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              No MCQ exams created yet
            </p>
            <Button onClick={() => setIsCreating(true)}>
              Create Your First Exam
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
