import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, History, Settings, 
  Play, TrendingUp, Award, Clock,
  ChevronRight, Brain, User
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">Welcome back, {user?.displayName || "Candidate"}</h1>
            <p className="text-neutral-400">Ready to level up your interview skills today?</p>
          </div>
          <div className="flex gap-4">
            <Link to="/setup" className="btn-primary px-6 py-3">
              <Play className="w-5 h-5 fill-current" />
              Start Interview
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Total Interviews", value: stats.totalInterviews, icon: Clock, color: "text-blue-400" },
            { label: "Average Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "text-purple-400" },
            { label: "Best Performance", value: `${stats.bestScore}%`, icon: Award, color: "text-emerald-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 flex items-center gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  Recent Activity
                </h3>
                <Link to="/history" className="text-sm text-blue-400 hover:underline">View All</Link>
              </div>
              
              <div className="space-y-4">
                {stats.recentInterviews.length > 0 ? stats.recentInterviews.map((interview) => (
                  <div key={interview.id} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center font-bold text-blue-400">
                        {interview.score}%
                      </div>
                      <div>
                        <p className="font-bold">{interview.role || "General Interview"}</p>
                        <p className="text-xs text-neutral-500">{new Date(interview.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
                )) : (
                  <div className="text-center py-12 text-neutral-500">
                    No interviews yet. Start your first one!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/20">
              <Brain className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold mb-4">AI Recommendation</h3>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                Based on your recent performance, we recommend practicing more on 
                <strong> System Design</strong> and <strong>Behavioral Questions</strong>.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
                View Learning Path
              </button>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-neutral-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/setup" className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="font-bold text-sm">New Session</span>
                </Link>
                <Link to="/history" className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-bold text-sm">Review History</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
