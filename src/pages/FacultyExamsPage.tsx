import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "motion/react";

const INITIAL_EXAMS = [
  { id: 1, course: "PHYS-301", name: "Midterm Examination", date: "Oct 15, 2026", time: "10:00 AM", status: "upcoming" },
  { id: 2, course: "CS-402", name: "Final Presentation", date: "Nov 02, 2026", time: "14:00 PM", status: "draft" },
  { id: 3, course: "PHYS-301", name: "Quiz 1", date: "Sep 20, 2026", time: "09:00 AM", status: "completed" },
];

export default function FacultyExamsPage() {
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [isScheduling, setIsScheduling] = useState(false);
  const [newExam, setNewExam] = useState({ course: "", name: "", date: "", time: "" });

  const handleScheduleExam = () => {
    if (!newExam.course || !newExam.name || !newExam.date || !newExam.time) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setExams([{
      id: Date.now(),
      ...newExam,
      status: "upcoming"
    }, ...exams]);
    
    setIsScheduling(false);
    setNewExam({ course: "", name: "", date: "", time: "" });
    toast.success("Exam scheduled successfully");
  };

  const handleEdit = () => {
    toast.info("Edit functionality is in development.");
  };

  const handleDetails = () => {
    toast.info("Details functionality is in development.");
  };

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8 p-4 sm:p-0">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[2.5rem] p-8 border border-primary/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <h1 className="text-4xl font-display font-extrabold tracking-tight">Exam Planner</h1>
            <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed font-medium">Schedule and manage examinations.</p>
          </div>
          
          <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
            <DialogTrigger render={
              <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground flex items-center gap-2 relative z-10 h-12 px-6">
                <Plus className="w-4 h-4" /> Schedule Exam
              </Button>
            } />
            <DialogContent className="rounded-[2.5rem] border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Exam</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm mt-2">
                <div className="space-y-2">
                  <Label>Course Code</Label>
                  <Input 
                    placeholder="e.g. PHYS-301"
                    value={newExam.course} 
                    onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                    className="bg-muted/20 border-none rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exam Name</Label>
                  <Input 
                    placeholder="e.g. Midterm Examination"
                    value={newExam.name} 
                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                    className="bg-muted/20 border-none rounded-xl h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      placeholder="e.g. Oct 15, 2026"
                      value={newExam.date} 
                      onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                      className="bg-muted/20 border-none rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input 
                      placeholder="e.g. 10:00 AM"
                      value={newExam.time} 
                      onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                      className="bg-muted/20 border-none rounded-xl h-11"
                    />
                  </div>
                </div>
                <Button onClick={handleScheduleExam} className="w-full mt-4 h-11 rounded-xl bg-primary text-primary-foreground gap-2">
                  <Save className="w-4 h-4" /> Schedule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, i) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 border-none shadow-sm bg-muted/10 rounded-[2.5rem] flex flex-col gap-4 relative group h-full">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant={exam.status === 'upcoming' ? 'default' : exam.status === 'draft' ? 'secondary' : 'outline'}>
                    {exam.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{exam.course}</p>
                  <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{exam.name}</h2>
                </div>
                
                <div className="space-y-2 mt-2 bg-background/50 p-4 rounded-2xl">
                  <p className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> {exam.date}</p>
                  <p className="text-sm text-muted-foreground ml-6">{exam.time}</p>
                </div>

                <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
                   <Button onClick={handleEdit} variant="outline" className="rounded-xl hover:bg-muted" size="sm">Edit</Button>
                   <Button onClick={handleDetails} variant="outline" className="rounded-xl hover:bg-muted" size="sm">Details</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
