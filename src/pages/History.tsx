import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { 
  History as HistoryIcon, Calendar, 
  ChevronRight, Award, Trash2, Search, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import BackButton from "../components/BackButton";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const interviews = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]");
      const userInterviews = interviews
        .filter((h: any) => h.userId === user.uid)
        .map((h: any) => ({
          ...h,
          date: new Date(h.date).toLocaleDateString()
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setHistory(userInterviews);
    } else {
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate]);

  const deleteSession = (id: string) => {
    const interviews = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]");
    const updatedInterviews = interviews.filter((h: any) => h.id !== id);
    localStorage.setItem("hirevision_interviews", JSON.stringify(updatedInterviews));
    setHistory(history.filter(h => h.id !== id));
    toast.success("Session deleted");
  };

  const filteredHistory = history.filter(h => 
    h.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] -z-10" />
      
      <div className="max-w-6xl mx-auto px-8 py-24 relative">
        <BackButton />
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="ml-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <HistoryIcon className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black font-display tracking-tight leading-none mb-2">Interview <span className="text-blue-500">History</span></h1>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Review your past performance</p>
              </div>
            </div>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium placeholder:text-neutral-700"
            />
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white/[0.02] border border-white/10 rounded-[3.5rem] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <HistoryIcon className="w-20 h-20 text-neutral-800 mx-auto mb-8" />
            <h3 className="text-2xl font-black font-display mb-3">No sessions found</h3>
            <p className="text-neutral-500 font-medium mb-10 max-w-sm mx-auto">You haven't completed any interviews yet. Start your journey today.</p>
            <Link to="/setup" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">
              Start First Interview
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredHistory.map((session, i) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] hover:bg-white/[0.06] transition-all group flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity">
                  <Award className="w-32 h-32" />
                </div>
                
                <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Award className="w-10 h-10 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-display tracking-tight mb-2">{session.role}</h3>
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        <Calendar className="w-3.5 h-3.5 text-blue-500/50" /> {session.date}
                      </span>
                      <span className="px-3 py-1 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Score: {session.score}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-end">
                  <button 
                    onClick={() => deleteSession(session.id)}
                    className="p-4 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90"
                    title="Delete Session"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.setItem("hirevision_results", JSON.stringify(session.results));
                      localStorage.setItem("hirevision_profile", JSON.stringify({ name: session.name, role: session.role }));
                      navigate("/report");
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                  >
                    View Report
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
