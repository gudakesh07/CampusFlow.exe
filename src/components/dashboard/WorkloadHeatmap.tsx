import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { format, startOfYear, eachDayOfInterval, isSameDay } from "date-fns";

export default function WorkloadHeatmap() {
  const years = [2026];
  const startDate = startOfYear(new Date(2026, 0, 1));
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startDate,
      end: new Date(2026, 11, 31),
    });
  }, [startDate]);

  // Simulated workload data
  const workloadData = useMemo(() => {
    const data: Record<string, number> = {};
    days.forEach(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      // Random intensities (0-4)
      const intense = Math.random() < 0.2 ? Math.floor(Math.random() * 5) : 0;
      data[dateStr] = intense;
    });
    return data;
  }, [days]);

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted hover:bg-muted/80";
      case 1: return "bg-emerald-500/20 hover:bg-emerald-500/40";
      case 2: return "bg-emerald-500/50 hover:bg-emerald-500/70";
      case 3: return "bg-amber-500/60 hover:bg-amber-500/80";
      case 4: return "bg-destructive/60 hover:bg-destructive/80";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="p-6 border-none shadow-sm bg-muted/20 rounded-[2rem]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            Academic Momentum
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Your contribution and workload pattern for 2026.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
           <span>Less</span>
           <div className="flex gap-1">
             <div className="w-3 h-3 rounded-[2px] bg-muted" />
             <div className="w-3 h-3 rounded-[2px] bg-emerald-500/20" />
             <div className="w-3 h-3 rounded-[2px] bg-emerald-500/50" />
             <div className="w-3 h-3 rounded-[2px] bg-amber-500/60" />
             <div className="w-3 h-3 rounded-[2px] bg-destructive/60" />
           </div>
           <span>More</span>
        </div>
      </div>
      
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-4 scrollbar-hide">
        {days.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const intensity = workloadData[dateStr] || 0;
          return (
            <div 
              key={dateStr}
              className={`w-3 h-3 rounded-[2px] transition-colors cursor-pointer ${getColor(intensity)}`}
              title={`${format(day, "MMM d, yyyy")}: ${intensity === 0 ? 'Calm' : intensity < 3 ? 'Manageable' : 'Intense'}`}
            />
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-background rounded-xl border border-dashed text-[10px] text-muted-foreground italic flex items-center justify-between">
         <span>AI Insight: "Expect high volume exams around early May. Plan your revision now."</span>
         <span className="font-bold text-primary cursor-pointer hover:underline">View Mitigation Strategy</span>
      </div>
    </Card>
  );
}
