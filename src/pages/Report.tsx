import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, Download, Share2, 
  CheckCircle2, AlertCircle, BarChart3, TrendingUp,
  Award, Star, Zap, MessageSquare, Brain, Shirt, Mic
} from "lucide-react";
import confetti from "canvas-confetti";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

export default function Report() {
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [dressing, setDressing] = useState<any>(null);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem("hirevision_results") || "[]");
    const p = JSON.parse(localStorage.getItem("hirevision_profile") || "{}");
    const d = JSON.parse(localStorage.getItem("hirevision_dressing") || "null");
    setResults(r);
    setProfile(p);
    setDressing(d);

    if (r.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00FFC8", "#FF6EC7", "#C8A2FF"]
      });
    }
  }, []);

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white font-sans selection:bg-neon-teal/30">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,200,0.03),transparent)] -z-10" />
      
      <div className="max-w-6xl mx-auto px-8 py-16 relative">
        <BackButton />
        
        <header className="flex justify-between items-center mb-16">
          <div className="ml-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-teal rounded-2xl flex items-center justify-center shadow-lg shadow-neon-teal/20">
                <Trophy className="text-black w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-display tracking-tight">Interview <span className="text-neon-pink">Report</span></h1>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Performance Analysis v2.0</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
              <Share2 className="w-5 h-5 text-neutral-400 group-hover:text-white" />
            </button>
            <button className="neon-btn flex items-center gap-3">
              <Download className="w-5 h-5" /> Download PDF
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-12 bg-gradient-to-br from-neon-teal/20 to-neon-pink/20 border border-white/10 backdrop-blur-3xl rounded-[3.5rem] relative overflow-hidden shadow-2xl group hover-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/5 to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Award className="w-8 h-8 text-neon-teal" />
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Final Assessment</span>
              </div>
              <div className="flex items-end gap-8 mb-10">
                <h1 className="text-9xl font-black text-white leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,200,0.3)]">{averageScore}</h1>
                <div className="mb-4">
                  <div className="text-3xl font-black text-white/90 font-display tracking-tight">Overall Score</div>
                  <div className="text-neutral-400 font-medium max-w-md leading-relaxed mt-2">
                    {averageScore >= 80 
                      ? `CONGRATULATIONS, ${profile.name}! You've demonstrated exceptional readiness. This is a top-tier performance.` 
                      : `Solid effort, ${profile.name}! You've shown strong potential. Focus on the refinement areas below.`}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Confidence", val: "82%", icon: Zap, color: "text-neon-yellow" },
                  { label: "Clarity", val: "75%", icon: MessageSquare, color: "text-neon-teal" },
                  { label: "Technical", val: "88%", icon: Brain, color: "text-neon-lavender" },
                  { label: "Dressing", val: dressing ? `${dressing.score}%` : "N/A", icon: Shirt, color: "text-neon-pink" }
                ].map(s => (
                  <div key={s.label} className="p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon className={cn("w-3.5 h-3.5", s.color)} />
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{s.label}</div>
                    </div>
                    <div className="text-2xl font-black text-white">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <Trophy className="absolute -bottom-16 -right-16 w-80 h-80 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </motion.div>

          {/* Quick Insights */}
          <div className="space-y-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden group hover:border-neon-teal/30 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-20 h-20 text-neon-teal" />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-neon-teal/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-neon-teal" />
                </div>
                <h3 className="font-black font-display uppercase tracking-widest text-sm">Key Strengths</h3>
              </div>
              <ul className="space-y-5">
                {[
                  "Strong technical articulation",
                  "Excellent problem-solving logic",
                  "Professional communication tone"
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-neutral-400 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-neon-teal shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden group hover:border-neon-yellow/30 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-20 h-20 text-neon-yellow" />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-neon-yellow/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neon-yellow" />
                </div>
                <h3 className="font-black font-display uppercase tracking-widest text-sm">Areas to Improve</h3>
              </div>
              <ul className="space-y-5">
                {[
                  "Maintain more eye contact",
                  "Reduce filler words (um, ah)",
                  "Structure long answers better"
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-neutral-400 font-medium">
                    <AlertCircle className="w-5 h-5 text-neon-yellow shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dressing Analysis Section */}
        {dressing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-10 bg-white/5 border border-white/10 rounded-[3.5rem] relative overflow-hidden hover:border-neon-pink/30 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/3 text-center">
                <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-full border-8 border-neon-pink/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,110,199,0.1)]">
                    <div className="text-5xl font-black text-neon-pink">{dressing.score}%</div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-pink text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,110,199,0.3)]">
                    Attire Score
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black font-display mb-4 flex items-center gap-3">
                  <Shirt className="w-6 h-6 text-neon-pink" />
                  Dressing Checkup Results
                </h3>
                <p className="text-neutral-400 font-medium leading-relaxed mb-8">
                  Our visual AI analyzed your professional attire during the session. Here's the breakdown:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dressing.feedback?.split('\n').filter(f => f.trim()).map((f, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                      <div className="w-2 h-2 bg-neon-pink rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_#FF6EC7]" />
                      <span className="text-sm text-neutral-400 font-medium">{f.replace(/^[*-]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Breakdown */}
        <div className="space-y-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-black font-display flex items-center gap-4 tracking-tight">
              <BarChart3 className="w-10 h-10 text-neon-teal" />
              Question Breakdown
            </h2>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-500">
              {results.length} Total Questions
            </div>
          </div>
          
          <div className="space-y-8">
            {results.map((res, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white/5 border border-white/10 rounded-[3.5rem] hover:bg-white/[0.08] hover:border-neon-teal/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <MessageSquare className="w-40 h-40 text-neon-teal" />
                </div>
                
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 relative z-10">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-teal/10 text-neon-teal border border-neon-teal/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      Question {i + 1}
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-tight">{res.question}</h4>
                  </div>
                  <div className="px-8 py-4 bg-neon-teal/10 text-neon-teal border border-neon-teal/20 rounded-3xl text-xl font-black shadow-lg shadow-neon-teal/5">
                    {res.analysis?.score}<span className="text-xs text-neon-teal/50 ml-1">/100</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <Mic className="w-3 h-3" />
                      Your Response
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] relative">
                      <p className="text-neutral-400 text-sm leading-relaxed font-medium italic">"{res.answer}"</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-neon-teal flex items-center gap-2">
                      <Brain className="w-3 h-3" />
                      AI Insights & Feedback
                    </div>
                    <div className="p-8 bg-neon-teal/[0.03] border border-neon-teal/10 rounded-[2rem]">
                      <div className="text-sm text-neutral-300 leading-relaxed font-medium markdown-body">
                        <ReactMarkdown>{res.analysis?.feedback}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="mt-24 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="neon-btn px-12 py-6"
          >
            Return to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
}
