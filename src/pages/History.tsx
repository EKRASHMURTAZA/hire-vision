import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { 
  History as HistoryIcon, ArrowLeft, Calendar, 
  ChevronRight, Award, Trash2, Search, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

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
    <div className="max-w-5xl mx-auto px-6 py-20">
      <header className="flex justify-between items-center mb-12">
        <div>
          <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <HistoryIcon className="w-10 h-10 text-blue-500" />
            Interview History
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text"
            placeholder="Search by role or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all w-64"
          />
        </div>
      </header>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-32 bg-white/5 border border-white/10 rounded-[3rem]">
          <HistoryIcon className="w-16 h-16 text-neutral-700 mx-auto mb-6" />
          <h3 className="text-xl font-bold mb-2">No sessions found</h3>
          <p className="text-neutral-500 mb-8">You haven't completed any interviews yet.</p>
          <Link to="/setup" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
            Start Your First Interview
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredHistory.map((session) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.07] transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{session.role}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {session.date}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
                      Score: {session.score}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => deleteSession(session.id)}
                  className="p-3 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    localStorage.setItem("hirevision_results", JSON.stringify(session.results));
                    localStorage.setItem("hirevision_profile", JSON.stringify({ name: session.name, role: session.role }));
                    navigate("/report");
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                >
                  View Report
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
