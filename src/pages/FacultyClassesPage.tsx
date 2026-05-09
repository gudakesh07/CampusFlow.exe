import DashboardLayout from "@/components/layout/DashboardLayout";
import { useClasses, ClassSession } from "@/contexts/ClassContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Edit, MoreVertical, Search, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "motion/react";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export default function FacultyClassesPage() {
  const { classes, updateClass } = useClasses();
  
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);
  const [formData, setFormData] = useState<Partial<ClassSession>>({});
  const [viewingStudentsFor, setViewingStudentsFor] = useState<ClassSession | null>(null);

  const handleSaveEdit = () => {
    if (editingClass) {
      updateClass(editingClass.id, formData);
      setEditingClass(null);
    }
  };

  const SAMPLE_STUDENTS = [
    { name: "Alice Johnson", id: "STU-001" },
    { name: "Bob Smith", id: "STU-002" },
    { name: "Charlie Davis", id: "STU-003" },
    { name: "Diana Prince", id: "STU-004" }
  ];

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8 p-4 sm:p-0">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[2.5rem] p-8 border border-primary/10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <h1 className="text-4xl font-display font-extrabold tracking-tight relative z-10">My Classes</h1>
          <p className="text-muted-foreground mt-2 max-w-xl relative z-10 leading-relaxed font-medium">Manage your course offerings, edit schedules, and view enrolled students seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`p-6 border-none shadow-sm rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden group h-full ${c.status === 'cancelled' ? 'bg-muted/10 opacity-60' : 'bg-muted/10'}`}>
                <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                  <span className={`w-3 h-3 rounded-full ${COLOR_MAP[c.color] || 'bg-primary'}`} />
                </div>
                {c.status === 'cancelled' ? (
                  <Badge variant="destructive">Cancelled</Badge>
                ) : (
                  <Badge variant="secondary">{c.code}</Badge>
                )}
              </div>

              <div>
                <h2 className={`text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors ${c.status === 'cancelled' ? 'line-through' : ''}`}>{c.subject}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {c.day} at {c.start}:00 • {c.duration}h
                </p>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                <Dialog open={viewingStudentsFor?.id === c.id} onOpenChange={(open) => !open && setViewingStudentsFor(null)}>
                  <DialogTrigger render={
                    <Button className="flex-1 rounded-xl" variant="outline" disabled={c.status === 'cancelled'} onClick={() => setViewingStudentsFor(c)}>
                      <Users className="w-4 h-4 mr-2" /> Students
                    </Button>
                  } />
                  <DialogContent className="rounded-[2.5rem] border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle>{c.subject} - Enrolled Students</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search students..." className="pl-9 bg-muted/20 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {SAMPLE_STUDENTS.map(student => (
                          <div key={student.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/10 border-none hover:bg-muted/30 transition-colors">
                            <Avatar className="w-10 h-10 border border-border/50">
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.id}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={editingClass?.id === c.id} onOpenChange={(open) => {
                  if (!open) setEditingClass(null);
                }}>
                  <DialogTrigger render={
                    <Button size="icon" className="rounded-xl" variant="outline" disabled={c.status === 'cancelled'} onClick={() => {
                      setEditingClass(c);
                      setFormData({ day: c.day, start: c.start, room: c.room, subject: c.subject, duration: c.duration });
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  } />
                  <DialogContent className="rounded-[2.5rem] border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Class Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-sm">
                      <div className="space-y-2">
                        <Label>Subject Name</Label>
                        <Input 
                          value={formData.subject || ""} 
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="bg-muted/20 border-none rounded-xl h-11"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Day</Label>
                          <Input 
                            value={formData.day || ""} 
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            className="bg-muted/20 border-none rounded-xl h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Hour (24h)</Label>
                          <Input 
                            type="number"
                            value={formData.start || ""} 
                            onChange={(e) => setFormData({ ...formData, start: parseInt(e.target.value) })}
                            className="bg-muted/20 border-none rounded-xl h-11"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duration (hours)</Label>
                          <Input 
                            type="number"
                            step="0.5"
                            value={formData.duration || ""} 
                            onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                            className="bg-muted/20 border-none rounded-xl h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Room</Label>
                          <Input 
                            value={formData.room || ""} 
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            className="bg-muted/20 border-none rounded-xl h-11"
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveEdit} className="w-full mt-4 h-11 rounded-xl bg-primary text-primary-foreground gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
