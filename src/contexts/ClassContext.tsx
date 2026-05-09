import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export type ClassStatus = 'active' | 'cancelled';

export interface ClassSession {
  id: string;
  day: string;
  start: number;
  duration: number;
  subject: string;
  room: string;
  color: string;
  status: ClassStatus;
  code: string;
}

interface ClassContextType {
  classes: ClassSession[];
  cancelClass: (id: string, reason?: string) => void;
  updateClass: (id: string, data: Partial<ClassSession>) => void;
}

const INITIAL_CLASSES: ClassSession[] = [
  { id: "1", day: "Mon", start: 9, duration: 1.5, subject: "Intro to Quantum Mechanics", code: "PHYS-301", room: "Hall B", color: "blue", status: 'active' },
  { id: "2", day: "Mon", start: 14, duration: 1.5, subject: "Linear Algebra", code: "MATH-201", room: "Hall A", color: "emerald", status: 'active' },
  { id: "3", day: "Tue", start: 10, duration: 2, subject: "Compilers Lab", code: "CS-401L", room: "Lab 4", color: "purple", status: 'active' },
  { id: "4", day: "Wed", start: 9, duration: 1.5, subject: "Intro to Quantum Mechanics", code: "PHYS-301", room: "Hall B", color: "blue", status: 'active' },
  { id: "5", day: "Thu", start: 11, duration: 1.5, subject: "Ethics in AI", code: "CS-402", room: "Seminar 2", color: "amber", status: 'active' },
  { id: "6", day: "Fri", start: 14, duration: 2, subject: "Open Lab Session", code: "GEN-101", room: "Innovation Wing", color: "rose", status: 'active' },
];

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES);

  const cancelClass = (id: string, reason?: string) => {
    const sessionToCancel = classes.find(c => c.id === id);
    if (!sessionToCancel) return;

    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: 'cancelled' } : c));
    toast.success(`${sessionToCancel.subject} cancelled. Notifications sent to students.`);
    // Simulate email send
    console.log(`[SIMULATED EMAIL ALERT] To: enrolled-students@campusflow.edu`);
    console.log(`Subject: Important: Class Cancelled - ${sessionToCancel.subject} (${sessionToCancel.code})`);
    console.log(`Message: The session on ${sessionToCancel.day} at ${sessionToCancel.start}:00 has been cancelled. Reason: ${reason || 'Not specified'}`);
  };

  const updateClass = (id: string, data: Partial<ClassSession>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success("Class details updated.");
  };

  return (
    <ClassContext.Provider value={{ classes, cancelClass, updateClass }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
}
