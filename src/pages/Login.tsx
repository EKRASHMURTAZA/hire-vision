import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import BackButton from "../components/BackButton";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock login logic using localStorage
      const users = JSON.parse(localStorage.getItem("hirevision_users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("hirevision_user", JSON.stringify(user));
        toast.success("Welcome back!");
        
        if (user.userRole === "admin" || email === "ekrashmurtaza@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/setup");
        }
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#0D0F1A] relative overflow-hidden font-sans">
      <BackButton />
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-teal/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-12 relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-neon-teal rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-neon-teal/20 group hover:scale-110 transition-transform duration-500">
            <Brain className="text-black w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight leading-none mb-3">Welcome <span className="text-neon-pink">Back</span></h1>
          <p className="text-neutral-500 font-medium uppercase tracking-widest text-[10px]">Neural Interview Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-neon-teal transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-neon-teal/50 transition-all font-medium placeholder:text-neutral-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-neon-teal transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-neon-teal/50 transition-all font-medium placeholder:text-neutral-800"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="neon-btn w-full py-6 text-lg"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                Sign In
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-neutral-500 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-neon-teal font-black hover:text-neon-pink transition-colors">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
