import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Brain, Rocket, Shield, Target, Zap, LogOut, User, 
  ChevronRight, Star, CheckCircle2, Globe, Sparkles,
  MessageSquare, BarChart3, Video, ArrowRight
} from "lucide-react";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

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
    <div className="relative overflow-hidden bg-slate-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -z-10" />
      
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight font-display text-white">HireVision <span className="text-blue-500">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Pricing", "About"].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/redirect" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group">
                <User className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-bold text-white">{user.name || "Dashboard"}</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-10">
              <Sparkles className="w-4 h-4" />
              The Future of Interview Prep
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter font-display text-white">
              Master Your Next <br />
              <span className="text-gradient-blue">Big Opportunity.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              HireVision AI simulates real-world interviews with behavioral analysis, 
              real-time feedback, and adaptive questioning to build your confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to={user ? "/redirect" : "/setup"}
                className="btn-primary text-xl px-10 py-5 group"
              >
                {user ? "Go to Dashboard" : "Start Free Simulation"}
                <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <button className="btn-secondary text-xl px-10 py-5">
                Watch Demo
                <Zap className="w-6 h-6 text-blue-400 group-hover:scale-125 transition-transform" />
              </button>
            </div>

            <div className="mt-20 flex items-center justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {["Google", "Meta", "Amazon", "Apple", "Netflix"].map(brand => (
                <span key={brand} className="text-2xl font-black tracking-tighter font-display text-white">{brand}</span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-4 text-white">Advanced AI Capabilities</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our neural network analyzes every detail of your performance to provide actionable insights.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Adaptive Questions",
                desc: "AI adjusts difficulty based on your performance in real-time.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              },
              {
                icon: Brain,
                title: "Behavioral Analysis",
                desc: "Analyzes eye contact, confidence, and clarity using computer vision.",
                color: "text-indigo-400",
                bg: "bg-indigo-400/10"
              },
              {
                icon: Shirt,
                title: "Dressing Checkup",
                desc: "Get instant feedback on your professional attire and appearance.",
                color: "text-slate-400",
                bg: "bg-slate-400/10"
              },
              {
                icon: MessageSquare,
                title: "Natural Language",
                desc: "Speak naturally in Urdu, English, or Hindi with our polyglot AI.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              },
              {
                icon: BarChart3,
                title: "Skill Matrix",
                desc: "Visualize your strengths and weaknesses with detailed data points.",
                color: "text-indigo-400",
                bg: "bg-indigo-400/10"
              },
              {
                icon: Video,
                title: "Session Recording",
                desc: "Review your performance with synchronized video and AI feedback.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 group"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", feature.bg)}>
                  <feature.icon className={cn("w-8 h-8", feature.color)} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white/[0.02] py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8 leading-tight text-white">Trusted by 10,000+ <br />Candidates Worldwide</h2>
            <div className="space-y-6">
              {[
                "94% success rate in real interviews",
                "Average score improvement of 42%",
                "Used by top university career centers"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-lg font-medium text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Sarah J.", role: "Software Engineer at Google", text: "The behavioral analysis was a game changer. I didn't realize I was avoiding eye contact until HireVision pointed it out." },
              { name: "Ahmed K.", role: "Product Manager", text: "The Urdu language support is incredible. It felt like I was talking to a real human interviewer." }
            ].map((t, i) => (
              <div key={i} className="glass-card p-8 bg-white/[0.03]">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-400 text-sm italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-xs text-blue-400 uppercase tracking-widest">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="max-w-7xl mx-auto px-6 py-40 text-center">
      <div className="glass-card p-20 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-6xl font-black mb-8 text-white">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Join thousands of successful candidates who used HireVision to master their interview skills.</p>
          <Link to="/signup" className="btn-primary text-2xl px-12 py-6 inline-flex mx-auto">
            Get Started Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10" />
      </div>
    </section>
  </main>

  <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <Brain className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-black tracking-tight font-display text-white">HireVision AI</span>
    </div>
    <div className="flex gap-12">
      {["Privacy", "Terms", "Support", "Contact"].map(item => (
        <a key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
      ))}
    </div>
    <div className="text-sm text-slate-600 font-medium">
      © 2026 HireVision AI. All rights reserved.
    </div>
  </footer>
</div>
  );
}

// Helper icons
function Shirt(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      <path d="M10 10.5V22" />
      <path d="M14 10.5V22" />
      <path d="M12 2v2" />
    </svg>
  )
}
