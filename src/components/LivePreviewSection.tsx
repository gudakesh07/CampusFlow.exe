import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BarChart2, Bell, MessageSquare, Calendar, ShieldCheck, ChevronRight, BookOpen, Clock, Activity, Zap, CheckCircle2 } from "lucide-react";

const scenes = [
  { id: "student-dashboard", label: "Student Dashboard" },
  { id: "workload-heatmap", label: "Workload Heatmap" },
  { id: "ai-assistant", label: "AI Assistant" },
  { id: "announcement", label: "Real-time Updates" },
  { id: "analytics", label: "Analytics & Status" },
];

export default function LivePreviewSection() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % scenes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="demo" className="mt-20 relative px-4 sm:px-6 w-full max-w-6xl mx-auto">
      {/* Background glowing effects */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-primary/10 via-transparent to-cyan-500/10 blur-[100px] -z-10 rounded-full" />
      
      {/* Header section for the preview */}
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
         <div className="flex justify-start sm:items-center gap-2 sm:gap-4 overflow-x-auto pb-2 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(i)}
                className={`text-xs sm:text-sm font-medium transition-colors px-3 py-1.5 rounded-full whitespace-nowrap ${
                  activeScene === i ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {scene.label}
              </button>
            ))}
         </div>
         <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Preview
         </div>
      </div>

      {/* Main Dashboard Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/9] bg-background/80 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
      >
        {/* Fake Topbar */}
        <div className="absolute top-0 inset-x-0 h-14 border-b border-border/50 bg-background/50 flex items-center justify-between px-4 sm:px-6 z-30 backdrop-blur-md">
           <div className="flex gap-2 items-center w-16 sm:w-64 border-r-0 sm:border-r border-border/50 h-full">
             <div className="w-3 h-3 rounded-full bg-red-400 border border-black/10" />
             <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black/10" />
             <div className="w-3 h-3 rounded-full bg-green-400 border border-black/10" />
           </div>
           
           <div className="flex-1 flex justify-center sm:justify-start px-4">
             <div className="w-full max-w-sm h-8 bg-muted/40 rounded-full flex items-center px-4 border border-border/50 hidden sm:flex">
               <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-2"><Sparkles className="w-3 h-3" /> Search courses, documents, peers...</span>
             </div>
           </div>

           <div className="flex gap-4 items-center shrink-0">
             <div className="w-8 h-8 rounded-full bg-muted/50 hidden sm:flex items-center justify-center text-muted-foreground relative">
               <Bell className="w-4 h-4" />
               <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-[1.5px] border-background" />
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
               SR
             </div>
           </div>
        </div>

        {/* Fake Sidebar */}
        <div className="absolute top-14 bottom-0 left-0 w-16 sm:w-64 border-r border-border/50 bg-background/30 hidden md:flex flex-col py-6 px-4 z-20">
           <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu</div>
           <div className="space-y-1">
              {[
                { icon: BarChart2, label: "Dashboard", match: 0 },
                { icon: Calendar, label: "Planner & Heatmap", match: 1 },
                { icon: Sparkles, label: "AI Assistant", match: 2 },
                { icon: Bell, label: "Updates", match: 3 },
                { icon: Activity, label: "Analytics", match: 4 },
                { icon: ShieldCheck, label: "Settings", match: -1 }
              ].map((item, i) => {
                 const isActive = item.match === activeScene;
                 return (
                 <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary font-semibold translate-x-1' : 'text-muted-foreground hover:bg-muted/50 font-medium'}`}>
                   <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                   <div className="text-sm">{item.label}</div>
                 </div>
              )})}
           </div>
        </div>

        {/* Content Area */}
        <div className="absolute top-14 bottom-0 right-0 left-0 md:left-64 bg-background/40 z-10 p-4 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
             {activeScene === 0 && <SceneStudentDashboard key="scene-0" />}
             {activeScene === 1 && <SceneWorkloadHeatmap key="scene-1" />}
             {activeScene === 2 && <SceneAIAssistant key="scene-2" />}
             {activeScene === 3 && <SceneFacultyAnnouncement key="scene-3" />}
             {activeScene === 4 && <SceneAnalytics key="scene-4" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

{/* SCENE 1 */}
function SceneStudentDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full h-full flex flex-col"
    >
      <div className="flex justify-between items-end mb-8">
         <div>
            <div className="text-sm text-primary font-medium mb-1">Welcome back, Sarah 👋</div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">Your Academic Overview</div>
         </div>
         <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
            <Calendar className="w-3 h-3 shrink-0" />
            Today, Oct 24
         </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6">
         {[
           { icon: BookOpen, title: "Next Class", val: "Physics 101", desc: "In 15 mins" },
           { icon: Zap, title: "Productivity", val: "94%", desc: "+5% this week" },
           { icon: CheckCircle2, title: "Assignments", val: "2 Pending", desc: "Due tomorrow", hiddenOnMobile: true },
         ].map((stat, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * i, duration: 0.5 }}
               className={`bg-background border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm ${stat.hiddenOnMobile ? 'hidden md:block' : ''}`}
            >
               <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                 <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg"><stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /></div>
                 <span className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</span>
               </div>
               <div className="text-lg sm:text-2xl font-bold font-display">{stat.val}</div>
               <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{stat.desc}</div>
            </motion.div>
         ))}
      </div>

      <div className="flex-1 bg-background border border-border/50 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
         <div className="text-sm font-semibold mb-4 text-foreground">Recent Activity</div>
         <div className="space-y-4 overflow-y-auto">
            {[
              { icon: BookOpen, title: "Database Systems", desc: "Dr. Smith uploaded Lecture 4 slides", time: "2h ago", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: MessageSquare, title: "Project Group", desc: "Alex mentioned you in a comment", time: "4h ago", color: "text-green-500", bg: "bg-green-500/10" },
              { icon: Activity, title: "Assignment Upload", desc: "You successfully submitted 'OS Lab 2'", time: "Yesterday", color: "text-purple-500", bg: "bg-purple-500/10" }
            ].map((item, i) => (
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3 + (i * 0.1) }}
                 key={i} 
                 className="flex items-center gap-3 sm:gap-4 border-b border-border/20 pb-4 last:border-0"
               >
                 <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                    <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${item.color}`} />
                 </div>
                 <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium text-foreground">{item.title}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground w-40 sm:w-auto truncate">{item.desc}</div>
                 </div>
                 <div className="text-[10px] sm:text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 sm:py-1 rounded-sm border border-border/30">
                   {item.time}
                 </div>
               </motion.div>
            ))}
         </div>
      </div>
    </motion.div>
  );
}

{/* SCENE 2 */}
function SceneWorkloadHeatmap() {
  const days = Array.from({ length: 30 });
  
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.7 }}
      className="w-full h-full flex flex-col relative"
    >
       {/* Floating tooltip */}
       <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.8 }}
         className="absolute top-4 sm:top-10 right-4 sm:right-10 bg-destructive text-destructive-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg text-[10px] sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 z-30 tracking-wide max-w-[200px] sm:max-w-none text-left leading-tight"
       >
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
          High Academic Pressure Expected Next Week
       </motion.div>

       <div className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">Workload Heatmap</div>
       <div className="text-sm text-muted-foreground mb-6">AI-predicted academic pressure for the next 30 days</div>
       
       <div className="flex-1 bg-background border border-border/50 rounded-2xl p-6 sm:p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-3 z-10 w-full max-w-3xl">
             {days.map((_, i) => {
                // generate some fake workload colors
                const intensity = Math.random();
                let colorClass = "bg-green-500/20 border-green-500/30"; // low
                if (i > 15 && i < 22) { // the high pressure week
                   colorClass = Math.random() > 0.5 ? "bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.3)] border-red-500" : "bg-orange-500/60 border-orange-500/50";
                } else if (intensity > 0.7) {
                   colorClass = "bg-yellow-500/40 border-yellow-500/40";
                }

                return (
                   <motion.div
                     key={i}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: i * 0.02, type: "spring" }}
                     className={`aspect-square rounded-md sm:rounded-lg border backdrop-blur-sm ${colorClass}`}
                   />
                );
             })}
          </div>

          <div className="hidden sm:flex absolute bottom-4 right-4 items-center gap-2 text-[10px] text-muted-foreground bg-background/80 px-3 py-1.5 rounded-lg border border-border/50 shadow-sm backdrop-blur-md">
             <span>Low</span>
             <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/30" />
             <div className="w-3 h-3 rounded-sm bg-yellow-500/40 border border-yellow-500/40" />
             <div className="w-3 h-3 rounded-sm bg-orange-500/60 border border-orange-500/50" />
             <div className="w-3 h-3 rounded-sm bg-red-500/80 border border-red-500" />
             <span>High</span>
          </div>
       </div>
    </motion.div>
  );
}

{/* SCENE 3 */}
function SceneAIAssistant() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex items-center justify-center sm:justify-end sm:pr-8"
    >
       <div className="w-full sm:w-[400px] h-[90%] bg-background/90 backdrop-blur-xl border border-primary/30 rounded-3xl shadow-[0_0_40px_rgba(14,165,233,0.15)] flex flex-col overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-primary to-purple-500" />
          
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                 <Sparkles className="w-4 h-4 text-cyan-400" />
             </div>
             <span className="font-semibold text-sm">CampusFlow AI</span>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-4">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="self-end bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[80%]"
             >
               Summarize Unit 4
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
               className="self-start bg-primary/10 text-foreground px-4 py-3 rounded-2xl rounded-tl-sm text-sm border border-primary/20 max-w-[90%] relative overflow-hidden"
             >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="space-y-3 relative z-10">
                   <div className="font-semibold text-primary">Unit 4: Abstract Data Types</div>
                   <div className="text-xs text-muted-foreground leading-relaxed">
                     ADTs define data and operations independently of implementation. Key concepts include: <br/>
                     • Stacks (LIFO)<br/>
                     • Queues (FIFO)<br/>
                     • Linked Lists
                   </div>
                   
                   <div className="pt-2 flex gap-2">
                      <div className="text-[10px] bg-background px-2 py-1 rounded-md border border-primary/20 font-medium cursor-pointer hover:bg-primary/5">Generate Quiz</div>
                      <div className="text-[10px] bg-background px-2 py-1 rounded-md border border-primary/20 font-medium cursor-pointer hover:bg-primary/5">View Flashcards</div>
                   </div>
                </div>
             </motion.div>
          </div>

          <div className="p-4 border-t border-border/50">
             <div className="h-10 w-full bg-secondary/50 rounded-xl border border-border flex items-center px-4">
                 <div className="w-1.5 h-4 bg-primary rounded-full animate-pulse" />
             </div>
          </div>
       </div>
    </motion.div>
  );
}

{/* SCENE 4 */}
function SceneFacultyAnnouncement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col relative"
    >
      <div className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">Your Schedule</div>
      <div className="text-sm text-muted-foreground mb-8">Real-time timetable synchronization</div>
      
      {/* Background Calendar layout */}
      <div className="flex-1 grid grid-cols-5 gap-2 opacity-60">
         {[...Array(20)].map((_, i) => (
           <div key={i} className="border border-border/30 rounded-lg p-2 flex flex-col gap-1">
             <div className="text-[10px] text-muted-foreground font-medium mb-1">8:00 AM</div>
             {i % 4 === 0 && <div className="h-10 w-full bg-primary/10 rounded-md border border-primary/20 flex flex-col justify-center px-2"><div className="w-3/4 h-2 bg-primary/30 rounded" /><div className="w-1/2 h-1.5 bg-primary/20 rounded mt-1" /></div>}
             {i === 8 && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0.3, scale: 0.95 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="h-12 w-full bg-destructive/20 rounded-md border border-destructive/30 line-through flex flex-col justify-center px-2 relative overflow-hidden" 
                >
                   <div className="w-3/4 h-2 bg-destructive/40 rounded mb-1" />
                   <div className="w-1/2 h-1.5 bg-destructive/30 rounded" />
                   <div className="absolute inset-x-0 top-1/2 h-0.5 bg-destructive z-10" />
                </motion.div>
             )}
             {i === 9 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                  className="h-12 w-full bg-green-500/20 rounded-md border border-green-500/30 flex flex-col justify-center px-2" 
                >
                   <div className="w-[80%] h-2 bg-green-500/40 rounded mb-1" />
                   <div className="w-[40%] h-1.5 bg-green-500/30 rounded mt-1" />
                </motion.div>
             )}
           </div>
         ))}
      </div>

      {/* Floating Notification */}
      <motion.div
        initial={{ opacity: 0, x: 50, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute top-4 right-4 left-4 sm:left-auto bg-background border border-border shadow-2xl rounded-2xl p-3 sm:p-4 w-auto sm:w-72 backdrop-blur-md z-30"
      >
         <div className="flex gap-3">
           <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
             <Bell className="w-5 h-5 text-blue-500" />
           </div>
           <div>
             <div className="font-semibold text-sm">DBMS Class Cancelled</div>
             <div className="text-xs text-muted-foreground mt-1">Rescheduled to tomorrow 10:00 AM by Dr. Smith</div>
           </div>
         </div>
      </motion.div>
    </motion.div>
  );
}

{/* SCENE 5 */}
function SceneAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col gap-4 sm:gap-6"
    >
      <div className="flex justify-between items-end mb-4">
         <div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">Analytics Overview</div>
            <div className="text-sm text-muted-foreground hidden sm:block">Track class performance and engagement</div>
         </div>
         <div className="flex items-center -space-x-2">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-8 h-8 rounded-full border-2 border-background bg-secondary/80 flex items-center justify-center text-[10px] font-bold text-muted-foreground" 
              >
                {String.fromCharCode(65 + i)}
              </motion.div>
            ))}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
         {/* Chart 1 */}
         <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <div className="text-sm font-semibold text-foreground">Class Attendance Rate</div>
               <div className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</div>
            </div>
            <div className="flex-1 flex items-end gap-2 sm:gap-4 h-full pt-4">
               {[40, 70, 45, 90, 60, 85].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, type: "spring" }}
                    className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-md border-t border-primary/30 relative group"
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded">
                       {h}%
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Department Activity */}
         <div className="hidden sm:flex bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex-col gap-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full" />
            
             <div className="flex justify-between items-center mb-0 relative z-10">
               <div className="text-sm font-semibold text-foreground">Live Department Activity</div>
               <div className="text-[10px] text-cyan-500 flex items-center gap-1 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> Live</div>
             </div>
            
             {[
               { user: "Dr. Smith", action: "published grades for CS101" },
               { user: "Prof. Alan", action: "created a new assignment" },
               { user: "Sarah J.", action: "submitted final project" }
             ].map((evt, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-3 relative z-10 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                   <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-foreground">
                     {evt.user.charAt(0)}
                   </div>
                   <div className="flex-1 text-xs">
                      <span className="font-semibold">{evt.user}</span> <span className="text-muted-foreground">{evt.action}</span>
                   </div>
                </motion.div>
             ))}
            
            <div className="mt-auto h-8 w-full bg-muted/20 border border-dashed border-border/50 rounded-xl flex items-center justify-center">
               <div className="text-[10px] font-medium text-muted-foreground">End of feed</div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
