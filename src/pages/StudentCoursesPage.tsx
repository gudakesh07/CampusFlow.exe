import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function StudentCoursesPage() {
  const navigate = useNavigate();
  const COURSES = [
    { 
      id: "PHYS-301", 
      name: "Quantum Mechanics", 
      progress: 60, 
      faculty: "Dr. Aris",
      nextAssignment: "Due in 2 days",
      status: "active"
    },
    { 
      id: "CS-402", 
      name: "Ethics in AI", 
      progress: 85, 
      faculty: "Prof. Vance",
      nextAssignment: "Due next week",
      status: "good"
    },
    { 
      id: "PHYS-305L", 
      name: "Computational Physics Lab", 
      progress: 40, 
      faculty: "Dr. Freeman",
      nextAssignment: "Due tomorrow",
      status: "urgent"
    }
  ];

  const handleFeatureNotImplemented = () => {
    toast.info("This feature is currently in development for the prototype.");
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-2">Manage your enrolled courses and track your progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <Card 
              key={course.id} 
              className="p-6 border-none shadow-sm bg-muted/10 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => navigate(`/dashboard/student/courses/${course.id}`)}
            >
              {course.status === "urgent" && <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />}
              {course.status === "active" && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
              {course.status === "good" && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />}

              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <Badge variant={course.status === "urgent" ? "destructive" : "secondary"}>
                  {course.id}
                </Badge>
              </div>

              <div>
                <h2 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">{course.name}</h2>
                <p className="text-sm text-muted-foreground">Instructor: {course.faculty}</p>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Course Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleFeatureNotImplemented(); }} 
                  className="w-full rounded-xl" 
                  variant="outline"
                >
                  {course.status === 'urgent' ? (
                    <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {course.nextAssignment}</span>
                  ) : course.nextAssignment}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
