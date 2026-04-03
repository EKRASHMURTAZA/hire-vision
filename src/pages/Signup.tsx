import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import BackButton from "../components/BackButton";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock signup logic using localStorage
      const users = JSON.parse(localStorage.getItem("hirevision_users") || "[]");
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error("User already exists");
      }

      const newUser = {
        uid: Math.random().toString(36).substring(2, 15),
        name,
        email,
        password, // In a real app, never store passwords in plain text
        userRole,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem("hirevision_users", JSON.stringify(users));
      localStorage.setItem("hirevision_user", JSON.stringify(newUser));

      toast.success("Account created successfully!");
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/setup");
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
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
          <h1 className="text-4xl font-black font-display tracking-tight leading-none mb-3">Create <span className="text-neon-pink">Account</span></h1>
          <p className="text-neutral-500 font-medium uppercase tracking-widest text-[10px]">Neural Interview Registration</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-2">Full Name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-neon-teal transition-colors" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-neon-teal/50 transition-all font-medium placeholder:text-neutral-800"
              />
            </div>
          </div>

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

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-2">Account Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserRole("user")}
                className={`flex-1 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] ${userRole === "user" ? "bg-neon-teal border-neon-teal text-black shadow-xl shadow-neon-teal/20" : "bg-white/[0.02] border-white/10 text-neutral-500 hover:border-white/20"}`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setUserRole("admin")}
                className={`flex-1 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] ${userRole === "admin" ? "bg-neon-pink border-neon-pink text-white shadow-xl shadow-neon-pink/20" : "bg-white/[0.02] border-white/10 text-neutral-500 hover:border-white/20"}`}
              >
                Admin
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="neon-btn w-full py-6 text-lg"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-neutral-500 text-sm font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-neon-teal font-black hover:text-neon-pink transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
