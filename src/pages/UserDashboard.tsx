import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, History, Settings, 
  Play, TrendingUp, Award, Clock,
  ChevronRight, Brain, User, Sparkles,
  FileText, Target, Zap, BarChart3
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    bestScore: 0,
    recentInterviews: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);

  const skillData = [
    { subject: 'Technical', A: 85, fullMark: 100 },
    { subject: 'Clarity', A: 70, fullMark: 100 },
    { subject: 'Confidence', A: 90, fullMark: 100 },
    { subject: 'Behavioral', A: 65, fullMark: 100 },
    { subject: 'Dressing', A: 80, fullMark: 100 },
    { subject: 'Urdu/Hindi', A: 75, fullMark: 100 },
  ];

  const progressData = [
    { name: 'Mon', score: 40 },
    { name: 'Tue', score: 45 },
    { name: 'Wed', score: 60 },
    { name: 'Thu', score: 55 },
    { name: 'Fri', score: 75 },
    { name: 'Sat', score: 82 },
    { name: 'Sun', score: 85 },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchUserStats(u.uid);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserStats = (uid: string) => {
    try {
      const interviews = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]")
        .filter((i: any) => i.userId === uid)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const scores = interviews.map((i: any) => i.score || 0);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      const best = scores.length > 0 ? Math.max(...scores) : 0;

      setStats({
        totalInterviews: interviews.length,
        avgScore: avg,
        bestScore: best,
        recentInterviews: interviews.slice(0, 3)
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-teal border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#00FFC8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-teal/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-pink/5 blur-[120px] -z-10 animate-pulse" />
      
      <BackButton />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="ml-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-neon-teal/10 text-neon-teal border border-neon-teal/20 rounded-full text-[10px] font-black uppercase tracking-widest">Neural Dashboard</span>
              <span className="w-2 h-2 bg-neon-teal rounded-full animate-pulse shadow-[0_0_8px_#00FFC8]" />
              <span className="text-[10px] font-bold text-neon-teal uppercase tracking-widest">System Online</span>
            </div>
            <h1 className="text-5xl font-black font-display tracking-tighter">
              Welcome back, <span className="text-neon-pink">{user?.displayName || user?.name || "Candidate"}</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link to="/setup" className="neon-btn px-8 py-4">
              <Play className="w-5 h-5 fill-current" />
              New Session
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Total Interviews", value: stats.totalInterviews, icon: Clock, color: "text-neon-teal", trend: "+2 this week" },
            { label: "Average Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "text-neon-pink", trend: "Top 15% globally" },
            { label: "Best Performance", value: `${stats.bestScore}%`, icon: Award, color: "text-neon-yellow", trend: "Level 4 Expert" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{stat.label}</p>
                  <p className="text-4xl font-black font-display">{stat.value}</p>
                  <p className="text-[10px] font-bold text-neutral-600 mt-1 uppercase tracking-widest">{stat.trend}</p>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-32 h-32" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skill Matrix & Progress */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skill Matrix */}
              <div className="glass-card p-8">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 font-display uppercase tracking-widest">
                  <Target className="w-5 h-5 text-neon-teal" />
                  Skill Matrix
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#00FFC8"
                        fill="#00FFC8"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="glass-card p-8">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 font-display uppercase tracking-widest">
                  <TrendingUp className="w-5 h-5 text-neon-pink" />
                  Performance Trend
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6EC7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF6EC7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid rgba(255,110,199,0.2)', borderRadius: '12px' }}
                        itemStyle={{ color: '#FF6EC7', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#FF6EC7" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black flex items-center gap-3 font-display uppercase tracking-widest">
                   <History className="w-5 h-5 text-neon-teal" />
                   Recent Sessions
                </h3>
                <Link to="/history" className="text-xs font-black text-neon-teal hover:text-neon-pink uppercase tracking-widest transition-colors">View All History</Link>
              </div>
              
              <div className="space-y-4">
                {stats.recentInterviews.length > 0 ? stats.recentInterviews.map((interview) => (
                  <div key={interview.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] hover:border-neon-teal/30 transition-all cursor-pointer" onClick={() => {
                    localStorage.setItem("hirevision_results", JSON.stringify(interview.results));
                    localStorage.setItem("hirevision_profile", JSON.stringify({ name: interview.userName, role: interview.role }));
                    navigate("/report");
                  }}>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-neon-teal/10 border border-neon-teal/20 rounded-2xl flex items-center justify-center font-black text-neon-teal text-xl shadow-[0_0_10px_rgba(0,255,200,0.1)]">
                        {interview.score}%
                      </div>
                      <div>
                        <p className="font-black text-lg mb-1">{interview.role || "General Interview"}</p>
                        <div className="flex items-center gap-4">
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{new Date(interview.date).toLocaleDateString()}</p>
                          <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{interview.language}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-neon-teal uppercase tracking-widest">Completed</span>
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">15 mins duration</span>
                      </div>
                      <ChevronRight className="w-6 h-6 text-neutral-700 group-hover:text-neon-teal group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                    <History className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-neutral-600 mb-2">No sessions found</h4>
                    <p className="text-sm text-neutral-700 mb-8">Your interview journey starts here.</p>
                    <Link to="/setup" className="neon-btn inline-flex px-8 py-3 text-sm">Start First Session</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Insights & Quick Actions */}
          <div className="space-y-8">
            {/* AI Resume Score */}
            <div className="glass-card p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20 relative overflow-hidden">
              <Sparkles className="w-10 h-10 text-blue-400 mb-6 animate-pulse" />
              <h3 className="text-xl font-black mb-4 font-display uppercase tracking-widest">AI Resume Score</h3>
              <div className="flex items-end gap-4 mb-6">
                <span className="text-6xl font-black font-display">82</span>
                <span className="text-neutral-500 font-bold mb-2 uppercase tracking-widest">/ 100</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed mb-8 font-medium">
                Your resume is highly optimized for <strong className="text-white">Software Engineering</strong> roles. We recommend adding more keywords related to <strong className="text-white">System Design</strong>.
              </p>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                Optimize Resume
              </button>
            </div>

            {/* Interview Readiness */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-black mb-8 font-display uppercase tracking-widest flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400" />
                Readiness
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Technical Knowledge", score: 85, color: "bg-blue-500" },
                  { label: "Behavioral Prep", score: 62, color: "bg-purple-500" },
                  { label: "Communication", score: 78, color: "bg-emerald-500" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-neutral-500">{item.label}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={cn("h-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                View Learning Path
              </button>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-8">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3 font-display uppercase tracking-widest">
                <Settings className="w-5 h-5 text-neutral-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/setup" className="w-full p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex items-center gap-4 transition-all group">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <span className="font-black text-sm block">New Session</span>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Start practicing</span>
                  </div>
                </Link>
                <Link to="/history" className="w-full p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex items-center gap-4 transition-all group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <History className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-black text-sm block">Review History</span>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Analyze past sessions</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
