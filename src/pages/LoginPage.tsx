import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, Mail, Lock, Sparkles, ArrowRight, Brain, Shield, BookOpen, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "student@campusflow.edu" && password === "student123") {
      toast.success("Logged in as Student (Demo)");
      navigate("/dashboard/student");
      return;
    }
    if (email === "faculty@campusflow.edu" && password === "faculty123") {
      toast.success("Logged in as Faculty (Demo)");
      navigate("/dashboard/faculty");
      return;
    }
    if (email === "admin@campusflow.edu" && password === "admin123") {
      toast.success("Logged in as Admin (Demo)");
      navigate("/dashboard/admin");
      return;
    }
    toast.error("Invalid demo credentials. Check the hints above.");
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // For demo, route everything to student dashboard
      // Based on AuthContext logic if someone gets 'admin' it could route differently, but let's just go student
      toast.success(`Welcome, ${result.user.displayName}`);
      navigate(`/dashboard/student`);
    } catch (error) {
      toast.error("Failed to sign in with Google.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 selection:bg-primary/10">
      <Link to="/" className="absolute top-8 left-4 sm:left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
        <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center group-hover:-translate-x-1 transition-transform">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-primary w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Access Your Orbit</h1>
          <p className="text-muted-foreground font-light mt-2">Log in to your specialized academic environment.</p>
        </div>

        <Card className="rounded-[2rem] border-none shadow-xl bg-background/80 backdrop-blur-xl">
          <CardHeader>
             <div className="bg-primary/10 p-4 rounded-xl text-xs">
                <p className="font-bold mb-2">Demo Accounts (For Testing):</p>
                <div className="space-y-1 text-muted-foreground flex flex-col gap-1">
                   <div className="flex justify-between border-b border-primary/10 pb-1"><span>Student:</span> <span className="font-mono text-foreground font-medium">student@campusflow.edu / student123</span></div>
                   <div className="flex justify-between border-b border-primary/10 pb-1 pt-1"><span>Faculty:</span> <span className="font-mono text-foreground font-medium">faculty@campusflow.edu / faculty123</span></div>
                   <div className="flex justify-between pt-1"><span>Admin:</span> <span className="font-mono text-foreground font-medium">admin@campusflow.edu / admin123</span></div>
                </div>
             </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Institute Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@university.edu" 
                    className="pl-10 rounded-xl h-11 bg-muted/20 border-none focus-visible:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 pr-10 rounded-xl h-11 bg-muted/20 border-none focus-visible:ring-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="secondary" className="w-full h-12 rounded-xl mt-4 font-semibold flex items-center gap-2 group">
                Enter Dashboard (Demo) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <div className="w-full h-[1px] bg-border relative mt-2">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Or authenticate with</span>
            </div>
            <Button 
               onClick={handleGoogleSignIn}
               disabled={isLoading}
               variant="outline" 
               className="w-full h-12 rounded-xl border-none bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-3">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              {isLoading ? "Signing in..." : "Institutional Single Sign-On (Google)"}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Need an account? <a href="#" className="text-primary font-medium hover:underline">Contact your administrator</a>
        </p>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale pointer-events-none">
          <BookOpen className="w-6 h-6" />
          <Brain className="w-6 h-6" />
          <Shield className="w-6 h-6" />
          <Sparkles className="w-6 h-6" />
        </div>
      </motion.div>
    </div>
  );
}
