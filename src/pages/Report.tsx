import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, ArrowLeft, Download, Share2, 
  CheckCircle2, AlertCircle, BarChart3, TrendingUp,
  Award, Star, Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import ReactMarkdown from "react-markdown";

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
        colors: ["#3b82f6", "#6366f1", "#ffffff"]
      });
    }
  }, []);

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0) / results.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <div className="flex gap-3">
          <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
            <Download className="w-5 h-5" /> Download PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Score Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-white/80" />
              <span className="text-sm font-bold uppercase tracking-widest text-white/60">Performance Summary</span>
            </div>
            <div className="flex items-end gap-6 mb-8">
              <h1 className="text-8xl font-black text-white">{averageScore}</h1>
              <div className="mb-4">
                <div className="text-2xl font-bold text-white/90">Overall Score</div>
                <div className="text-white/60">
                  {averageScore >= 80 
                    ? `CONGRATULATIONS, ${profile.name}! You'll get the job! Your performance was outstanding.` 
                    : `Great job, ${profile.name}! You're in the top 15%.`}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: "Confidence", val: "82%" },
                { label: "Clarity", val: "75%" },
                { label: "Technical", val: "88%" },
                { label: "Dressing", val: dressing ? `${dressing.score}%` : "N/A" }
              ].map(s => (
                <div key={s.label} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">{s.label}</div>
                  <div className="text-xl font-bold text-white">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
          <Trophy className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
        </motion.div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold">Key Strengths</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Strong technical articulation",
                "Excellent problem-solving logic",
                "Professional communication tone"
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold">Areas to Improve</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Maintain more eye contact",
                "Reduce filler words (um, ah)",
                "Structure long answers better"
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          Question Breakdown
        </h2>
        <div className="space-y-6">
          {results.map((res, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-2xl">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Question {i + 1}</div>
                  <h4 className="text-xl font-bold mb-4">{res.question}</h4>
                </div>
                <div className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full text-sm font-bold">
                  Score: {res.analysis?.score}/100
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Your Answer</div>
                  <p className="text-neutral-400 text-sm leading-relaxed italic">"{res.answer}"</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">AI Feedback</div>
                  <div className="text-sm text-neutral-300 leading-relaxed markdown-body">
                    <ReactMarkdown>{res.analysis?.feedback}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
