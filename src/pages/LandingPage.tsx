import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Clock, Shield, Sparkles, Brain, GraduationCap, CheckCircle2, Zap, ShieldCheck, Server, MonitorSmartphone, ChevronDown, Check, Lock, MousePointerClick } from "lucide-react";
import { useState } from "react";
import LivePreviewSection from "@/components/LivePreviewSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

const faqs = [
  { q: "Is student data secure?", a: "Absolutely. We employ enterprise-grade encryption and privacy-first architecture to ensure all student data is strictly confidential." },
  { q: "Can we integrate with existing LMS systems?", a: "Yes, our Enterprise plan offers custom integrations with Canvas, Blackboard, Moodle, and other major LMS platforms via our robust API." },
  { q: "Does the AI use institution-specific data?", a: "Yes. Our AI Academic RAG trains specifically on your institution's provided materials and curriculum to give precisely relevant answers." },
  { q: "Is onboarding support provided?", a: "We provide comprehensive onboarding, from data migration to faculty training, ensuring a smooth transition for your entire campus." },
  { q: "Can schools customize dashboards?", a: "Yes, role-based dashboards can be tailored to highlight the specific metrics and tools your faculty and students use most." },
  { q: "Does CampusFlow support mobile devices?", a: "CampusFlow is fully responsive and offers a seamless mobile experience for students to check timetables or assignments on the go." },
];

export default function LandingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b pt-[10px]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Logo className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight pr-2 sm:pr-0">CampusFlow<span className="text-muted-foreground hidden sm:inline">.exe</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#heatmap" className="hover:text-foreground transition-colors">Insights</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button className="h-9 px-4 sm:h-10 sm:px-6 text-xs sm:text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-8 border border-border shadow-sm">
              <Logo className="w-3 h-3 text-primary" />
              <span>The Academic Buddy has arrived</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 tracking-tight">
              Transforming Academic Chaos <br />
              <span className="text-muted-foreground">into a Peaceful Flow.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              One elegant workspace for assignments, timetables, and AI-powered study. Designed to quiet the noise and amplify your learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="px-8 flex items-center gap-2 rounded-2xl h-14">
                  Launch Your Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 rounded-2xl h-14"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <LivePreviewSection />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Master Your Academic Realm</h2>
            <p className="text-muted-foreground">Everything you need to succeed, without the friction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "AI Academic RAG", desc: "Upload PDFs and notes. Our AI answers questions based strictly on your institution's materials." },
              { icon: Clock, title: "Calm Timetable", desc: "A drag-and-drop schedule that visualizes your day without the clutter of a messy calendar." },
              { icon: BookOpen, title: "Resource Hub", desc: "Centralized lecture notes, assignments, and exam schedules accessible from any device." },
              { icon: Shield, title: "Secure Communications", desc: "Built-in department and class groups. No phone numbers needed, just flow." },
              { icon: Sparkles, title: "Workload Insights", desc: "GitHub-style heatmaps that predict stress and help you plan your week ahead." },
              { icon: GraduationCap, title: "Role-Based Control", desc: "Customized environments for Students, Faculty, and Admin in one unified system." },
            ].map((f, i) => (
              <Card key={i} className="p-8 border-none bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all group rounded-[2rem]">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workload Heatmap Preview */}
      <section id="heatmap" className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <h2 className="text-4xl font-display font-bold mb-6 not-italic leading-tight">
              Predict Stress. <br />
              <span className="text-muted-foreground text-3xl font-light">Visualize Your Momentum.</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-[15px] pl-[10px] leading-relaxed font-light">
              Our unique Heatmap tracks your upcoming deadlines and exams, shifting from a calm green to an alert red. AI analyzed workload tells you when to push and when to rest.
            </p>
            <div className="space-y-4 pl-[10px]">
              {['Manageable week ahead', '3 Overlapping deadlines detected', 'Self-care suggested for Friday'].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-destructive/20 blur-3xl rounded-full opacity-50 -z-10" />
            <div className="bg-background/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 border shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full" />
               <div className="flex justify-between items-end mb-8 relative z-10">
                 <div>
                   <h3 className="font-display font-semibold text-lg">Fall Semester</h3>
                   <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Stress Predictor</p>
                 </div>
                 <div className="flex gap-2 items-center text-xs text-muted-foreground font-medium">
                    <span>Rest</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-[3px] bg-muted/50" />
                      <div className="w-3 h-3 rounded-[3px] bg-emerald-500/40" />
                      <div className="w-3 h-3 rounded-[3px] bg-amber-500/60" />
                      <div className="w-3 h-3 rounded-[3px] bg-destructive/80" />
                    </div>
                    <span>Peak</span>
                 </div>
               </div>
               
               <div className="flex gap-4 relative z-10">
                 <div className="flex flex-col justify-between text-[10px] text-muted-foreground font-medium py-1">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                 </div>
                 <div className="flex-1 flex flex-col gap-2">
                   <div className="grid grid-cols-12 grid-rows-7 gap-1.5 sm:gap-2">
                      {Array.from({ length: 84 }).map((_, i) => {
                        const col = i % 12;
                        const row = Math.floor(i / 12);
                        // Make some pattern
                        const isRed = [13, 22, 23, 31, 32, 45, 58, 60].includes(i);
                        const isYellow = [12, 14, 21, 24, 30, 33, 44, 46, 57, 59, 61].includes(i);
                        const isGreen = [5, 15, 25, 34, 47, 62, 70, 75, 80].includes(i);
                        
                        return (
                          <motion.div 
                            key={i} 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: (col * 0.02) + (row * 0.01) }}
                            viewport={{ once: true }}
                            className={`aspect-square rounded-[4px] sm:rounded-md transition-colors hover:ring-2 hover:ring-offset-2 hover:ring-primary ${
                              isRed ? 'bg-destructive/80 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 
                              isYellow ? 'bg-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 
                              isGreen ? 'bg-emerald-500/40' : 'bg-muted/50'
                            }`} 
                          />
                        )
                      })}
                   </div>
                   <div className="flex justify-between text-[10px] text-muted-foreground font-medium mt-2">
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                   </div>
                 </div>
               </div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 viewport={{ once: true }}
                 drag
                 dragConstraints={{ top: -100, left: -200, right: 200, bottom: 20 }}
                 className="absolute -bottom-6 sm:bottom-8 bg-background p-5 rounded-[1.5rem] shadow-2xl border border-primary/20 z-20 backdrop-blur-md ml-[50px] w-[240px] cursor-grab active:cursor-grabbing"
               >
                  <div className="flex gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Logo className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">AI Prediction</p>
                      <p className="text-sm font-medium leading-tight">"You may experience high stress on Nov 14th due to 2 exams. Prep early."</p>
                    </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-muted/10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
              Simple Pricing for Modern Institutions
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto font-light">
              Flexible plans designed for schools, colleges, coaching centers, and universities of every size.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-16 h-8 rounded-full bg-secondary border border-border p-1 relative transition-colors focus:outline-none"
              >
                <motion.div 
                  className="w-6 h-6 rounded-full bg-primary shadow-md"
                  animate={{ x: isYearly ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium flex items-center gap-2 ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider">20% OFF</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {/* STARTER */}
            <Card className="p-8 pb-10 bg-[#0a0a0c]/90 text-white border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col mt-4 lg:mt-0 group transition-all duration-500 hover:shadow-white/10 hover:border-white/30 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-all duration-700" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wider mb-6 border border-white/20 w-max z-10 transition-colors group-hover:bg-white/20">
                Perfect for Small Institutions
              </div>
              <h3 className="font-display font-semibold text-2xl mb-2 z-10">Starter Plan</h3>
              <p className="text-slate-400 text-sm font-light mb-6 z-10">Small coaching centers and schools.</p>
              <div className="mb-6 h-[48px] flex items-end z-10">
                <span className="text-4xl font-bold font-display">₹{isYearly ? '3,999' : '4,999'}</span>
                <span className="text-slate-400 text-sm mb-1 ml-1">/mo</span>
              </div>
              <div className="space-y-4 mb-8 flex-1 z-10">
                {["Up to 300 students", "Timetable management", "Assignment tracking", "Faculty & Student dashboards", "Notifications system", "Basic analytics", "Email support"].map((ft, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full rounded-xl bg-white text-black hover:bg-slate-200 z-10 transition-all">Get Started</Button>
            </Card>

            {/* PROFESSIONAL (MOST POPULAR) */}
            <Card className="p-8 pb-10 bg-[#0a0a0c]/90 text-white border-primary/50 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col transform lg:-translate-y-4 hover:-translate-y-6 transition-all duration-500 hover:shadow-primary/20 hover:border-primary ring-1 ring-primary/20 group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-6 border border-primary/30 w-max z-10 shadow-sm shadow-primary/10 transition-colors group-hover:bg-primary/30">
                <Logo className="w-3 h-3" />
                Most Popular
              </div>
              <h3 className="font-display font-semibold text-2xl mb-2 z-10">Professional</h3>
              <p className="text-slate-400 text-sm font-light mb-6 z-10">Medium-sized colleges and institutions.</p>
              <div className="mb-6 h-[48px] flex items-end z-10">
                <span className="text-4xl font-bold font-display text-white relative">
                  ₹{isYearly ? '11,999' : '14,999'}
                </span>
                <span className="text-slate-400 text-sm mb-1 ml-1">/mo</span>
              </div>
              <div className="space-y-4 mb-8 flex-1 z-10">
                {["Up to 3000 students", "AI academic assistant", "Workload heatmaps & smart scheduling", "In-app communication", "Department management & roles", "Advanced analytics", "Priority support"].map((ft, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground z-10 shadow-md animate-in fade-in zoom-in duration-500">Start Free Trial</Button>
            </Card>
            
            {/* ENTERPRISE */}
            <Card className="p-8 pb-10 bg-[#0a0a0c]/90 text-white border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col mt-4 lg:mt-0 group transition-all duration-500 hover:shadow-white/10 hover:border-white/30 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-all duration-700" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20 w-max z-10 transition-colors group-hover:bg-white/20">
                Unlimited Scalability
              </div>
              <h3 className="font-display font-semibold text-2xl mb-2 z-10">Enterprise</h3>
              <p className="text-slate-400 text-sm font-light mb-6 z-10">Large universities and educational groups.</p>
              <div className="mb-6 h-[48px] flex items-end z-10">
                <span className="text-3xl font-bold font-display">Custom Pricing</span>
              </div>
              <div className="space-y-4 mb-8 flex-1 z-10">
                {["Unlimited students", "Dedicated cloud infrastructure", "Institution-specific AI models", "Advanced API & Integrations", "On-premise deployment option", "Predictive institutional analytics", "24/7 premium support & manager"].map((ft, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <Server className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full rounded-xl bg-white text-black hover:bg-slate-200 z-10 transition-all">Contact Sales</Button>
            </Card>

            {/* AI+ PLAN */}
            <Card className="p-8 pb-10 bg-[#0a0a0c] text-white border-white/10 shadow-2xl relative overflow-hidden flex flex-col mt-4 lg:mt-0 group hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(8,145,178,0.3)]">
               {/* Animated background elements */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-400/20 transition-all duration-700" />
               
               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-6 border border-cyan-500/30 w-max z-10">
                <Brain className="w-3 h-3" />
                Future of Education
              </div>
              <h3 className="font-display font-semibold text-2xl mb-2 z-10 flex items-center gap-2">
                CampusFlow AI+
              </h3>
              <p className="text-slate-400 text-sm font-light mb-6 z-10">AI-first personalized academic intelligence.</p>
              <div className="mb-6 flex items-end gap-1 z-10 h-[48px]">
                <span className="text-4xl font-bold font-display">₹{isYearly ? '39' : '49'}</span>
                <span className="text-slate-400 text-sm mb-1">/student</span>
              </div>
              <div className="space-y-4 mb-8 flex-1 z-10">
                {["Everything in Professional", "Personalized AI study assistant", "AI-generated notes & quizzes", "Burnout & overload prediction", "Student productivity tracking", "Institutional knowledge AI"].map((ft, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full border-none rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white z-10 shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all">Enable Intelligence</Button>
            </Card>

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Built for Institutions That Care About Student Success</h2>
            <p className="text-muted-foreground">Reliable, secure, and thoughtfully crafted for the academic paradigm.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
             {[
               { i: ShieldCheck, t: "Secure Infrastructure" },
               { i: Lock, t: "Privacy-First" },
               { i: Server, t: "Scalable Systems" },
               { i: Brain, t: "AI Insights" },
               { i: MousePointerClick, t: "Seamless Onboarding" }, 
               { i: MonitorSmartphone, t: "Dedicated Support" },
             ].map((Item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm border text-primary">
                     <Item.i className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">{Item.t}</span>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-primary/5" />
         <div className="absolute -top-[100%] -left-[50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-tr from-primary/20 via-transparent to-cyan-500/20 blur-[100px] rounded-full -z-10" />
         
        <div className="max-w-4xl mx-auto text-center relative z-10 md:py-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight leading-[1.1]">
            Transform Your Institution Into a <br className="hidden md:block"/> <span className="not-italic text-[55px] md:text-[55px] lg:text-[55px] text-primary/90">Smarter Academic Ecosystem</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            CampusFlow.exe helps institutions reduce academic chaos, improve communication, and create a calmer, more productive learning environment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
             <Button size="lg" className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/20 w-full sm:w-auto">Book a Demo</Button>
             <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background w-full sm:w-auto">Start Free Trial</Button>
             <Button size="lg" variant="ghost" className="h-14 px-8 rounded-2xl text-muted-foreground hover:text-foreground w-full sm:w-auto">Talk to Sales</Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-muted/10 relative">
        <div className="max-w-3xl mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about implementing CampusFlow.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`border ${openFaqIndex === i ? 'border-primary/40 bg-background/80 shadow-md ring-1 ring-primary/10' : 'border-border/60 bg-background/50'} rounded-2xl overflow-hidden transition-all duration-300 hover:border-border/80`}>
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                     <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-muted-foreground font-light text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Logo className="text-primary w-4 h-4" />
            </div>
            <span className="font-display font-medium">CampusFlow<span className="text-muted-foreground">.exe</span></span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Academic Systems Architect. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Manual</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
