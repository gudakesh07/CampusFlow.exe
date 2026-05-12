import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkloadHeatmap from "@/components/dashboard/WorkloadHeatmap";
import SemesterModal from "@/components/dashboard/SemesterModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const UPCOMING_DEADLINES = [
  {
    id: 1,
    title: "Quantum Mechanics Problem Set #4",
    course: "PHYS-301",
    date: "Tomorrow, 11:59 PM",
    status: "urgent",
    urgent: true,
  },
  {
    id: 2,
    title: "Ethics in AI: Term Paper Draft",
    course: "CS-402",
    date: "May 14, 2026",
    status: "pending",
    urgent: false,
  },
  {
    id: 3,
    title: "Lab Report: Laser Spectroscopy",
    course: "PHYS-305L",
    date: "May 18, 2026",
    status: "pending",
    urgent: false,
  },
];

const TODAY_SCHEDULE = [
  {
    time: "09:00 - 10:30",
    subject: "Quantum Mechanics",
    room: "Hall B",
    color: "blue",
  },
  {
    time: "11:00 - 12:30",
    subject: "Compilers",
    room: "Lab 4",
    color: "purple",
  },
  {
    time: "14:00 - 15:30",
    subject: "Advanced Linear Algebra",
    room: "Hall A",
    color: "emerald",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleFeatureNotImplemented = () => {
    toast.info("This feature is currently in development for the prototype.");
  };

  return (
    <DashboardLayout role="student">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Welcome Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              How's the flow, Rituraj?
            </h1>
            <p className="text-muted-foreground font-light mt-2">
              You have 3 assignments due this week. Stay focused.
            </p>
          </div>

          <WorkloadHeatmap />

          {/* Today's Path */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Today's Path
              </h2>
              <Button
                onClick={() => navigate("/dashboard/student/schedule")}
                variant="ghost"
                className="text-xs gap-2"
              >
                Full Timetable <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-4">
              {TODAY_SCHEDULE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate("/dashboard/student/schedule")}
                >
                  <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all flex items-center gap-6 rounded-2xl group cursor-pointer bg-muted/10">
                    <div className="w-32 text-xs font-bold text-muted-foreground">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {item.subject}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 inline-flex items-center gap-1">
                        📍 {item.room}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          {/* Deadlines Widget */}
          <div>
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" /> Impending Waves
            </h2>
            <div className="space-y-4">
              {UPCOMING_DEADLINES.map((d) => (
                <Card
                  key={d.id}
                  className="p-5 border-none shadow-sm bg-muted/40 rounded-3xl relative overflow-hidden group"
                >
                  {d.urgent && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
                  )}
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex justify-between items-center">
                    {d.course}
                    {d.urgent && (
                      <Badge variant="destructive" className="text-[8px] h-4">
                        URGENT
                      </Badge>
                    )}
                  </p>
                  <h3 className="font-semibold text-sm leading-snug mb-3 group-hover:text-primary transition-colors">
                    {d.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {d.date}
                    </p>
                    <Button
                      onClick={handleFeatureNotImplemented}
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-lg text-xs bg-background shadow-sm"
                    >
                      Review
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Hub Mini */}
          <Card className="p-6 bg-primary text-primary-foreground rounded-[2.5rem] shadow-lg relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <Brain className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-display font-bold mb-2">
              Academic AI Hub
            </h3>
            <p className="text-xs text-primary-foreground/80 font-light leading-relaxed mb-6">
              "Rituraj, based on PHYS-301 Lecture 12, would you like a summary
              of Heisenberg's Uncertainty Principle?"
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/dashboard/student/ai")}
                variant="secondary"
                size="sm"
                className="rounded-xl flex-1 text-xs font-bold"
              >
                Try Summary
              </Button>
              <Button
                onClick={() => navigate("/dashboard/student/ai")}
                variant="outline"
                size="sm"
                className="rounded-xl flex-1 text-xs border-primary-foreground/30 hover:bg-white/10"
              >
                Ask Q&A
              </Button>
            </div>
          </Card>

          {/* CV Analyzer Card */}
          <Card className="p-6 bg-gradient-to-br from-orange-500 to-rose-500 text-primary-foreground rounded-[2.5rem] shadow-lg relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <FileText className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-display font-bold mb-2">
              AI CV Analyzer
            </h3>
            <p className="text-xs text-primary-foreground/80 font-light leading-relaxed mb-6">
              Upload your CV and get AI-powered feedback on how to improve it
              and stand out!
            </p>
            <Button
              onClick={() => navigate("/dashboard/student/cv-analyzer")}
              variant="secondary"
              size="sm"
              className="w-full rounded-xl text-xs font-bold"
            >
              <Sparkles className="w-3 h-3 mr-2" /> Analyze CV
            </Button>
          </Card>

          {/* Semester Card */}
          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-500 text-primary-foreground rounded-[2.5rem] shadow-lg relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <BookOpen className="w-8 h-8 mb-4 opacity-90" />
            <h3 className="text-xl font-display font-bold mb-2">
              Semester Dashboard
            </h3>
            <p className="text-xs text-primary-foreground/80 font-light leading-relaxed mb-6">
              View results, fill forms, pay fees & generate mock exams!
            </p>
            <SemesterModal />
          </Card>

          {/* Recent Resources */}
          <div>
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" /> Fresh Drops
            </h2>
            <div className="space-y-2">
              {[
                { name: "Final_Revision_L12.pdf", prof: "Dr. Aris" },
                { name: "Compilers_CheatSheet.png", prof: "Faculty Bloom" },
              ].map((r, i) => (
                <div
                  onClick={handleFeatureNotImplemented}
                  key={i}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Shared by {r.prof}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Semester Segment */}
      <div className="mt-12">
      </div>
    </DashboardLayout>
  );
}
