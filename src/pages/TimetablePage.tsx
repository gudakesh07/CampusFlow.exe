import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Sparkles, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useClasses } from "@/contexts/ClassContext";
import * as React from "react";
import { useState } from "react";
import { format, subWeeks, addWeeks, startOfWeek, endOfWeek } from "date-fns";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export default function TimetablePage() {
  const { classes } = useClasses();
  const [currentDate, setCurrentDate] = useState(new Date("2026-05-11"));

  const handlePrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const dateLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;

  const currentWeekNum = parseInt(format(currentDate, 'w'), 10);

  // Dynamically modify classes slightly based on the week to show them changing
  const dynamicClasses = classes.map((c, index) => {
    const isCancelled = (c.status === 'cancelled') || (currentWeekNum % 2 === 0 && index === 2);
    const dayOffset = (currentWeekNum + index) % 5; // shift days slightly
    const mappedDay = DAYS[dayOffset];
    const hourShift = (currentWeekNum * index) % 4;
    const start = Math.min(Math.max(c.start + hourShift - 2, 8), 18);
    return { ...c, day: mappedDay, start, status: isCancelled ? 'cancelled' : 'active' };
  });

  return (
    <DashboardLayout role="student">
      <div className="flex flex-col flex-1 w-full min-h-[600px] h-full">
        <div className="flex justify-between items-end mb-6 shrink-0">
           <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Academic Rhythm</h1>
              <p className="text-muted-foreground font-light mt-1">Your personalized path through the semester.</p>
           </div>
           <div className="flex gap-2 bg-muted/30 p-1 rounded-xl border">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={handlePrevWeek}><ChevronLeft className="w-4 h-4" /></Button>
              <div className="px-4 flex items-center text-xs font-bold uppercase tracking-widest min-w-[140px] justify-center">{dateLabel}</div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={handleNextWeek}><ChevronRight className="w-4 h-4" /></Button>
           </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-muted/10 p-6 overflow-hidden relative flex-1 flex flex-col min-h-0">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Clock className="w-64 h-64" />
           </div>
           
           <div className="grid gap-x-2 gap-y-0 relative flex-1" style={{ gridTemplateColumns: 'minmax(40px, auto) repeat(7, 1fr)', gridTemplateRows: 'auto repeat(13, minmax(0, 1fr))' }}>
              {/* Empty corner */}
              <div className="h-8 md:h-10 border-b border-muted/30" />
              
              {/* Day Headers */}
              {DAYS.map(day => (
                <div key={day} className="h-8 md:h-10 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground pt-1 md:pt-2 border-b border-muted/30">
                  {day}
                </div>
              ))}

              {/* Time Slots & Events */}
              {HOURS.map((hour, rowIdx) => (
                <React.Fragment key={hour}>
                  <div className="text-right pr-2 md:pr-4 text-[9px] md:text-[10px] font-bold text-muted-foreground/50 tabular-nums border-t border-muted/30 pt-1" style={{ gridRow: rowIdx + 2, gridColumn: 1 }}>
                    {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </div>
                  
                  {DAYS.map((day, colIdx) => {
                    const event = dynamicClasses.find(item => item.day === day && Math.floor(item.start) === hour);
                    return (
                      <div key={`${day}-${hour}`} className="border-t border-muted/30 relative h-full w-full" style={{ gridRow: rowIdx + 2, gridColumn: colIdx + 2 }}>
                         {event && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className={`absolute top-0.5 md:top-1 left-0.5 right-0.5 rounded-lg md:rounded-xl p-1 md:px-2 md:py-1.5 shadow-sm border border-background/20 backdrop-blur-sm z-10 select-none group transition-all overflow-hidden ${
                               event.status === 'cancelled'
                                 ? 'bg-destructive/10 text-destructive border-destructive/20 opacity-70'
                                 : event.color === 'blue' ? 'bg-blue-500/10 text-blue-700 border-blue-200 cursor-pointer hover:shadow-lg hover:z-20' :
                                   event.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200 cursor-pointer hover:shadow-lg hover:z-20' :
                                   event.color === 'purple' ? 'bg-purple-500/10 text-purple-700 border-purple-200 cursor-pointer hover:shadow-lg hover:z-20' :
                                   event.color === 'amber' ? 'bg-amber-500/10 text-amber-700 border-amber-200 cursor-pointer hover:shadow-lg hover:z-20' :
                                   'bg-rose-500/10 text-rose-700 border-rose-200 cursor-pointer hover:shadow-lg hover:z-20'
                             }`}
                             style={{ height: `calc(${event.duration * 100}% - 4px)` }}
                           >
                              <div className="flex justify-between items-start">
                                 <p className="text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest opacity-70 leading-none mb-0.5 hidden sm:block">{event.day} • {Math.floor(event.start)}:{(event.start % 1 * 60).toString().padStart(2, '0')}</p>
                                 <p className="text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest opacity-70 leading-none mb-0.5 sm:hidden">{Math.floor(event.start)}:{(event.start % 1 * 60).toString().padStart(2, '0')}</p>
                                 {event.status === 'cancelled' && <Badge variant="destructive" className="h-3 text-[8px] px-1 uppercase scale-75 origin-top-right hidden md:inline-flex">Cancelled</Badge>}
                              </div>
                              <h4 className={`text-[10px] md:text-xs font-bold leading-tight ${event.status !== 'cancelled' && 'group-hover:translate-x-1'} transition-transform line-clamp-2 ${event.status === 'cancelled' ? 'line-through opacity-80' : ''}`}>{event.subject}</h4>
                              <p className="text-[8px] md:text-[9px] mt-0.5 md:mt-1 flex items-center gap-1 opacity-80 truncate">
                                <MapPin className="w-2 h-2 shrink-0" /> {event.room}
                              </p>
                           </motion.div>
                         )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
           </div>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center shrink-0 mt-6">
           {[
             { label: "Core Lectures", color: "bg-blue-500/20 text-blue-700" },
             { label: "Laboratory", color: "bg-purple-500/20 text-purple-700" },
             { label: "Electives", color: "bg-amber-500/20 text-amber-700" },
             { label: "Exam Window", color: "bg-rose-500/20 text-rose-700" },
             { label: "Cancelled", color: "bg-destructive/20 text-destructive" },
           ].map((l, i) => (
             <div key={i} className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${l.color} border border-current opacity-50`} />
                {l.label}
             </div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
