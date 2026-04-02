import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, BarChart3, Clock, Search, 
  ChevronRight, ArrowLeft, Shield, 
  MoreVertical, Filter, Download, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Admin() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    avgScore: 0,
    completionRate: "0%"
  });

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const isSystemAdmin = user.userRole === "admin" || user.email === "ekrashmurtaza@gmail.com";
      
      if (!isSystemAdmin) {
        navigate("/");
        return;
      }
      setIsAdmin(true);
      fetchAdminData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAdminData = () => {
    setIsLoading(true);
    try {
      // Fetch Users from localStorage
      const usersList = JSON.parse(localStorage.getItem("hirevision_users") || "[]").map((u: any) => ({
        ...u,
        id: u.uid,
        lastActive: "Recent"
      }));
      setUsers(usersList);

      // Fetch Interviews from localStorage
      const interviewsList = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]");
      
      const totalScore = interviewsList.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
      const avgScore = interviewsList.length > 0 ? Math.round(totalScore / interviewsList.length) : 0;

      setStats({
        totalUsers: usersList.length,
        totalInterviews: interviewsList.length,
        avgScore: avgScore,
        completionRate: "100%"
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold glow-text">Admin Console</h1>
              <p className="text-xs text-neutral-500">System Overview & Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-64 py-2 pl-10 text-sm"
            />
          </div>
          <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Total Users", val: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Interviews", val: stats.totalInterviews, icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10" },
            { label: "Avg Score", val: `${stats.avgScore}%`, icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Completion", val: stats.completionRate, icon: Shield, color: "text-amber-400", bg: "bg-amber-400/10" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div className="text-4xl font-black mb-1">{stat.val}</div>
              <div className="text-sm text-neutral-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <div className="flex gap-4">
              {["Users", "Interviews", "Reports"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.toLowerCase() ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-neutral-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-neutral-400">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-white/5">
                  <th className="px-8 py-6">User</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Interviews</th>
                  <th className="px-8 py-6">Last Active</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-xs text-neutral-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        "bg-emerald-500/10 text-emerald-500"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", "bg-emerald-500")} />
                        {user.userRole}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-sm">--</td>
                    <td className="px-8 py-6 text-sm text-neutral-400">{user.lastActive}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
