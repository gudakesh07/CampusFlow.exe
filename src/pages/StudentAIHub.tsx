import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, Sparkles, User, GraduationCap, Loader2, BookOpen } from "lucide-react";
import { askAcademicAssistant } from "@/services/aiService";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { toast } from "sonner";

type Message = {
  role: "user" | "ai";
  content: string;
};

// Mock context for the demo
const MOCK_ACADEMIC_CONTEXT = `
Lecture 12: Heisenberg's Uncertainty Principle (PHYS-301)
Instructor: Dr. Aris

Key Concept: It is fundamentally impossible to simultaneously determine the exact position (x) and momentum (p) of a subatomic particle.
Formula: Δx * Δp ≥ h / 4π
Conclusion: The more accurately we know the position, the less accurately we know the momentum, and vice versa. This is not a limitation of measuring instruments, but a fundamental property of quantum systems.
`;

export default function StudentAIHub() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Welcome to the Academic AI Hub, Rituraj. I have synchronized with your Course Context for Physics-301 and CS-402. How can I assist your studies today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    if (!overrideInput) setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await askAcademicAssistant(userMsg, MOCK_ACADEMIC_CONTEXT);
      setMessages(prev => [...prev, { role: "ai", content: response || "I'm sorry, I couldn't process that query." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error: The knowledge core is currently unavailable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([{ role: "ai", content: "Memory cleared. Restarting session." }]);
    toast.success("Chat history cleared.");
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
                 <Brain className="w-8 h-8 text-primary" /> AI Academic Hub
              </h1>
              <p className="text-muted-foreground font-light mt-1">Direct access to your institution's verified knowledge base.</p>
           </div>
           <Badge variant="outline" className="rounded-xl px-3 py-1 bg-primary/5 border-primary/20 text-primary flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              RAG Core Stable
           </Badge>
        </div>

        <Card className="flex-1 border-none shadow-xl rounded-[2.5rem] bg-muted/10 overflow-hidden flex flex-col">
           <div className="p-4 border-b bg-background/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <p className="text-xs font-bold uppercase tracking-widest">Active Knowledge Context: PHYS-301, CS-402</p>
              </div>
              <Button onClick={handleClearHistory} variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-tighter">Clear History</Button>
           </div>

           <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                 {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                         msg.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                       }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                       </div>
                       <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
                         msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-background shadow-sm rounded-tl-none border'
                       }`}>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                             <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                       </div>
                    </motion.div>
                 ))}
                 {isLoading && (
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                       </div>
                       <div className="bg-background shadow-sm border p-4 rounded-3xl rounded-tl-none">
                          <p className="text-xs text-muted-foreground animate-pulse italics">Consulting institutional database...</p>
                       </div>
                    </div>
                 )}
                 <div ref={scrollRef} />
              </div>
           </ScrollArea>

           <div className="p-4 border-t bg-background/50">
              <div className="relative flex items-center">
                 <Input 
                   placeholder="Ask about formulas, concepts, or summaries..." 
                   className="rounded-2xl h-14 pl-6 pr-16 bg-background border-none shadow-inner focus-visible:ring-primary/20"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 />
                 <Button 
                   size="icon" 
                   className="absolute right-2 rounded-xl h-10 w-10 shadow-lg shadow-primary/20"
                   onClick={() => handleSend()}
                   disabled={isLoading}
                 >
                    <Send className="w-4 h-4" />
                 </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-tighter font-bold">
                 CampusFlow.exe AI utilizes verified institutional data ONLY.
              </p>
           </div>
        </Card>

        <div className="grid grid-cols-3 gap-4">
           {[
             { label: "Summarize PHYS-301", icon: BookOpen },
             { label: "Explanations only", icon: Brain },
             { label: "Practice Questions", icon: GraduationCap },
           ].map((suggestion, i) => (
              <Button 
                key={i} 
                onClick={() => handleSend(suggestion.label)}
                variant="outline" 
                className="rounded-2xl h-12 bg-muted/20 border-none hover:bg-muted/40 transition-colors text-xs font-semibold gap-2"
              >
                 <suggestion.icon className="w-4 h-4 text-primary" />
                 {suggestion.label}
              </Button>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
