import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Video, Users, Calendar, Download, Play, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function CourseOverviewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleFeatureNotImplemented = () => {
    toast.info("This feature is currently in development for the prototype.");
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                 {courseId || "COURSE-101"}
               </div>
               <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Quantum Mechanics</h1>
               <p className="text-muted-foreground mt-2 font-medium">Instructor: Dr. Aris • 3 Credits • Fall 2026</p>
             </div>
             <div className="flex gap-3">
               <Button onClick={handleFeatureNotImplemented} variant="outline" className="gap-2"><MessageSquare className="w-4 h-4" /> Discussion</Button>
               <Button onClick={handleFeatureNotImplemented} className="gap-2"><Video className="w-4 h-4" /> Join Live Lecture</Button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-display font-bold">Recent Materials</h2>
              
              <Card className="p-0 border-border/50 overflow-hidden rounded-2xl flex flex-col sm:flex-row bg-background">
                 <div className="w-full sm:w-48 bg-muted pt-6 px-4 pb-4 flex flex-col justify-end relative overflow-hidden group border-r border-border/50 shrink-0">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                    <Play className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-full bg-white/90 p-2" />
                 </div>
                 <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Recorded Lecture</div>
                    <h3 className="font-bold text-lg mb-2">Lecture 12: Heisenberg's Uncertainty</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">An deep dive into the mathematical formulation of the uncertainty principle and its implications on quantum states.</p>
                    <div className="flex gap-2">
                       <Button size="sm" onClick={handleFeatureNotImplemented} variant="secondary" className="rounded-xl">Watch Reply</Button>
                       <Button size="sm" onClick={handleFeatureNotImplemented} variant="ghost" className="rounded-xl"><Download className="w-4 h-4" /></Button>
                    </div>
                 </div>
              </Card>

              <Card className="p-0 border-border/50 overflow-hidden rounded-2xl flex flex-col sm:flex-row bg-background">
                 <div className="w-full sm:w-48 bg-muted pt-6 px-4 pb-4 flex flex-col justify-end relative overflow-hidden group border-r border-border/50 shrink-0">
                    <FileText className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 relative z-10" />
                 </div>
                 <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Reading Material</div>
                    <h3 className="font-bold text-lg mb-2">Chapter 4.5: Spin Systems</h3>
                    <p className="text-sm text-muted-foreground mb-4">Required reading for upcoming Problem Set #4.</p>
                    <div className="flex gap-2">
                       <Button size="sm" onClick={handleFeatureNotImplemented} variant="secondary" className="rounded-xl">Read PDF</Button>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-border/50 rounded-2xl bg-muted/20">
                 <h2 className="text-lg font-display font-bold mb-4">Upcoming Deadlines</h2>
                 <div className="space-y-4">
                    <div className="flex flex-col gap-1 pb-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-colors" onClick={handleFeatureNotImplemented}>
                       <span className="font-semibold text-sm">Problem Set #4</span>
                       <span className="text-xs text-destructive font-medium">Due Tomorrow, 11:59 PM</span>
                    </div>
                    <div className="flex flex-col gap-1 cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-colors" onClick={handleFeatureNotImplemented}>
                       <span className="font-semibold text-sm">Midterm Exam</span>
                       <span className="text-xs text-muted-foreground font-medium">In 2 weeks</span>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
