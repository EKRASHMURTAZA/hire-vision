import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  History, 
  FileText, 
  TrendingUp, 
  Award, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Star, 
  Clock, 
  Target,
  ShieldCheck,
  Zap,
  Briefcase,
  ArrowUpRight,
  User as UserIcon,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

// Mock data for the chart
const performanceData = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 68 },
  { name: "Wed", score: 75 },
  { name: "Thu", score: 72 },
  { name: "Fri", score: 80 },
  { name: "Sat", score: 85 },
  { name: "Sun", score: 88 },
];

const skillData = [
  { subject: 'Communication', A: 120, fullMark: 150 },
  { subject: 'Technical', A: 98, fullMark: 150 },
  { subject: 'Confidence', A: 86, fullMark: 150 },
  { subject: 'Clarity', A: 99, fullMark: 150 },
  { subject: 'Body Language', A: 85, fullMark: 150 },
  { subject: 'Urdu Purity', A: 65, fullMark: 150 },
];

const recommendedJobs = [
  { title: "Senior Frontend Engineer", company: "TechFlow", match: 95, tags: ["React", "TypeScript"] },
  { title: "AI Solutions Architect", company: "NeuralNet", match: 88, tags: ["Python", "LLMs"] },
  { title: "Product Designer", company: "CreativeSync", match: 82, tags: ["Figma", "UI/UX"] },
];

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1`}>
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </motion.div>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const storedInterviews = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]");
      setInterviews(storedInterviews.filter((i: any) => i.userId === parsedUser.uid));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("hirevision_user");
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  const avgScore = interviews.length > 0 
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / interviews.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">HireVision</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">v2.5 Neural AI</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-xs font-bold text-slate-300">7 DAY STREAK</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/profile")}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600/20 text-blue-400">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user?.displayName || user?.name || "Candidate"}</span>
            </h2>
            <p className="text-slate-400 font-medium">Your neural performance is up 12% this week. Ready to practice?</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/interview")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 group"
            >
              Start New Session
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Brain} label="Total Simulations" value={interviews.length} trend="+2" color="blue" />
          <StatCard icon={Star} label="Avg. Neural Score" value={`${avgScore}%`} trend="+5%" color="indigo" />
          <StatCard icon={TrendingUp} label="Skill Growth" value="+18%" color="emerald" />
          <StatCard icon={Clock} label="Practice Time" value="12.4h" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance & Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Neural Trend</h3>
                    <p className="text-xs text-slate-400">Past 7 days performance</p>
                  </div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Skill Radar</h3>
                    <p className="text-xs text-slate-400">Multidimensional analysis</p>
                  </div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#1e293b" tick={false} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* AI Recommendations */}
            <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Neural Insights</h3>
                  <p className="text-sm text-slate-400">Personalized recommendations based on your last session</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Target size={16} className="text-blue-400" />
                    Improve Urdu Purity
                  </h4>
                  <p className="text-sm text-slate-400">Our neural engine detected excessive English loanwords. Try using 'رابطہ' instead of 'contact' to boost your score.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400" />
                    Confidence Boost
                  </h4>
                  <p className="text-sm text-slate-400">Your eye contact was excellent (85%), but your speech pace was slightly high. Slow down for better clarity.</p>
                </div>
              </div>
            </section>

            {/* Recent Sessions */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
                <button 
                  onClick={() => navigate("/history")}
                  className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  View All <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {interviews.length > 0 ? (
                  interviews.slice(0, 5).map((session, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-900/60 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <History size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{session.role || "General Interview"}</h4>
                          <p className="text-xs text-slate-500 font-medium">{new Date(session.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Score</p>
                          <p className={`text-lg font-black ${session.score >= 80 ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {session.score}%
                          </p>
                        </div>
                        <ChevronRight className="text-slate-700 group-hover:text-white transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-slate-900/20 border border-dashed border-slate-800 p-12 rounded-3xl text-center">
                    <History className="mx-auto text-slate-700 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No sessions recorded yet. Start your first interview!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Daily Goals */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={14} className="text-blue-500" />
                Daily Neural Goals
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Complete 1 Simulation", done: true },
                  { label: "Urdu Purity > 80%", done: false },
                  { label: "Eye Contact > 70%", done: true },
                ].map((goal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border ${goal.done ? 'bg-blue-600 border-blue-600' : 'border-slate-700'} flex items-center justify-center`}>
                      {goal.done && <ShieldCheck size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${goal.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {goal.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Jobs */}
            <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={20} />
                <h3 className="font-bold">Neural Match Jobs</h3>
              </div>
              <div className="space-y-4">
                {recommendedJobs.map((job, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-sm">{job.title}</h4>
                        <p className="text-xs text-white/60">{job.company}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-300">
                        {job.match}% MATCH
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {job.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-black/20 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Explore All Matches
              </button>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => navigate("/resume-builder")}
                className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:bg-slate-800/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white">Resume Builder</h4>
                  <p className="text-xs text-slate-500">AI-powered optimization</p>
                </div>
              </button>

              <button className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:bg-slate-800/50 transition-all group opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white">Skill Roadmap</h4>
                  <p className="text-xs text-slate-500">Coming Soon</p>
                </div>
              </button>
            </section>

            {/* System Status */}
            <section className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                Neural Core Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Behavioral Engine</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Linguistic Processor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Emotion Neural Map</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
