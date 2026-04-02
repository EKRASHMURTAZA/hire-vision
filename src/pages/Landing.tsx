import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Brain, Rocket, Shield, Target, Zap, LogOut, User } from "lucide-react";

export default function Landing() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("hirevision_user");
    setUser(null);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] -z-10" />
      
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">HireVision AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            to="/history" 
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            History
          </Link>
          <Link 
            to="/admin" 
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Admin
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{user.name || user.email}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              AI-Powered Interview Coach
            </span>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Master Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Big Opportunity.
              </span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 leading-relaxed max-w-2xl">
              HireVision AI simulates real-world interviews with behavioral analysis, 
              real-time feedback, and adaptive questioning to build your confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={user ? "/redirect" : "/setup"}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                {user ? "Go to Dashboard" : "Start Free Simulation"}
                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                Watch Demo
                <Zap className="w-5 h-5 text-yellow-400" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
        >
          {[
            {
              icon: Target,
              title: "Adaptive Questions",
              desc: "AI adjusts difficulty based on your performance in real-time."
            },
            {
              icon: Brain,
              title: "Behavioral Analysis",
              desc: "Analyzes eye contact, confidence, and clarity using computer vision."
            },
            {
              icon: Shield,
              title: "Detailed Reports",
              desc: "Get a comprehensive breakdown of your strengths and weaknesses."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.07] transition-colors group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-blue-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
