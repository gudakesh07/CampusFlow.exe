import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileUp,
  Users,
  MessageSquare,
  Calendar,
  AlertCircle,
  MoreVertical,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { extractTextFromPDF } from "@/services/pdfService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClasses } from "@/contexts/ClassContext";
import { motion } from "motion/react";

const ACTIVE_CLASSES = [
  {
    id: 1,
    name: "Intro to Quantum Mechanics",
    code: "PHYS-301",
    students: 42,
    attendance: "92%",
    next: "Today, 09:00",
  },
  {
    id: 2,
    name: "Advanced Thermodynamics",
    code: "PHYS-402",
    students: 28,
    attendance: "88%",
    next: "Tomorrow, 11:00",
  },
  {
    id: 3,
    name: "Computational Physics Lab",
    code: "PHYS-305L",
    students: 15,
    attendance: "100%",
    next: "Wednesday, 14:00",
  },
];

export default function FacultyDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [lastExtracted, setLastExtracted] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { classes, cancelClass } = useClasses();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await extractTextFromPDF(file);
      setLastExtracted(text);
      toast.success("Academic content indexed. Students notified.");
      // In a real app, we would save this to Firestore for RAG
      console.log("Extracted Context Length:", text.length);
    } catch (error) {
      toast.error("Failed to process lecture notes.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelClass = (id: string) => {
    cancelClass(id, "Faculty emergency cancellation");
    setIsCancelDialogOpen(false);
  };

  const activeClassesList = classes.filter((c) => c.status === "active");

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8 p-4 sm:p-0">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[2.5rem] p-8 border border-primary/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-full">
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
              Faculty Control Center
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed font-medium">
              Manage your classes, resources, and student engagement.
            </p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Dialog
              open={isCancelDialogOpen}
              onOpenChange={setIsCancelDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl border-none bg-muted/40 hover:bg-muted/60 transition-colors flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" /> Cancel Class
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-none shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle>Cancel Upcoming Session</DialogTitle>
                  <DialogDescription>
                    Select an active class session to cancel. Students will be
                    notified.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2">
                  {activeClassesList.map((c) => (
                    <div
                      key={c.id}
                      className="flex justify-between items-center p-3 rounded-xl border bg-card hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div>
                        <p className="font-semibold text-sm">
                          {c.subject} ({c.code})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.day} at {c.start}:00 • {c.room}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-xs h-8"
                        onClick={() => handleCancelClass(c.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                  {activeClassesList.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      No active sessions to cancel.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" /> New Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Attach materials to sync with student AI assistants.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">
                          Analyzing Academic Content...
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Extracting text for RAG indexing
                        </p>
                      </div>
                    ) : lastExtracted ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        <p className="text-sm font-medium">
                          Text Processed Successfully
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {lastExtracted.substring(0, 100)}...
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLastExtracted(null)}
                        >
                          Clear and re-upload
                        </Button>
                      </div>
                    ) : (
                      <>
                        <FileUp className="w-12 h-12 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">
                            Drop PDF lecture notes here
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Materials will be auto-summarized for students
                          </p>
                        </div>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept=".pdf"
                          onChange={handleFileUpload}
                        />
                      </>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-none shadow-sm bg-muted/20 rounded-[2.5rem] flex flex-col gap-6 h-full">
              <h2 className="font-display font-semibold text-lg">
                Rapid Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Upload Notes",
                    icon: FileUp,
                    action: () => setIsUploadDialogOpen(true),
                  },
                  {
                    label: "Notify All",
                    icon: MessageSquare,
                    action: () => navigate("/dashboard/faculty/messages"),
                  },
                  {
                    label: "Exams",
                    icon: Calendar,
                    action: () => navigate("/dashboard/faculty/exams"),
                  },
                  {
                    label: "Resources",
                    icon: BookOpen,
                    action: () => navigate("/dashboard/faculty/classes"),
                  },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="flex flex-col items-center justify-center gap-3 p-4 bg-background rounded-3xl hover:bg-primary hover:text-primary-foreground transition-all group border shadow-sm"
                  >
                    <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Stats Overview */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Active Courses",
                value: "3",
                icon: BookOpen,
                color: "bg-blue-500/10 text-blue-600",
              },
              {
                label: "Pending Submissions",
                value: "112",
                icon: FileUp,
                color: "bg-amber-500/10 text-amber-600",
              },
              {
                label: "Average Attendance",
                value: "93.4%",
                icon: Users,
                color: "bg-emerald-500/10 text-emerald-600",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="p-6 border-none shadow-sm bg-muted/10 rounded-[2rem] flex flex-col justify-between h-full">
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                      {stat.label}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Classes Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Active Class Groups
            </h2>
            <Button
              onClick={() => toast.success("Downloading report...")}
              variant="ghost"
              size="sm"
            >
              Download Reports
            </Button>
          </div>
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest pl-8">
                    Course
                  </TableHead>
                  <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest">
                    Enrolled
                  </TableHead>
                  <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest">
                    Attendance
                  </TableHead>
                  <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest">
                    Next Lecture
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVE_CLASSES.map((cls) => (
                  <TableRow
                    key={cls.id}
                    onClick={() => navigate("/dashboard/faculty/classes")}
                    className="hover:bg-muted/10 border-b border-muted/50 transition-colors group cursor-pointer"
                  >
                    <TableCell className="py-6 pl-8">
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {cls.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold">
                          {cls.code}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {cls.students}
                        </span>
                        <Badge variant="secondary" className="text-[8px] h-4">
                          Verified
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: cls.attendance }}
                          />
                        </div>
                        <span className="text-xs font-semibold">
                          {cls.attendance}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {cls.next}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Options menu opened");
                        }}
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Resource Management Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="p-8 border-none bg-primary/5 rounded-[2.5rem] flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Recent
                Announcements
              </h2>
              <Button
                onClick={() => toast.success("Announcements archived")}
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10"
              >
                Archive All
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Mid-Term Exam Syllabus Updated",
                  time: "2h ago",
                  role: "all",
                },
                {
                  title: "Lab Session Cancelled for Thursday",
                  time: "5h ago",
                  role: "PHYS-305L",
                },
              ].map((notif, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/dashboard/faculty/messages")}
                  className="bg-background rounded-2xl p-4 border shadow-sm flex justify-between items-center group cursor-pointer hover:border-primary/30 transition-all"
                >
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                      Recipient: {notif.role} • {notif.time}
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/dashboard/faculty/messages");
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-none bg-muted/20 rounded-[2.5rem] flex flex-col justify-center items-center text-center gap-4 border-2 border-dashed border-muted">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm">
              <FileUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">
                Push Course Materials
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                Upload PDFs or Notes to instantly notify students and update AI
                knowledge base.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl px-10 border-none bg-background shadow-sm hover:bg-muted/50 transition-colors"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              Select Files
            </Button>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
