import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, BarChart3, Clock, Search, 
  ChevronRight, Shield, Activity,
  MoreVertical, Filter, Download, Loader2,
  Cpu, Database, Globe, Zap, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export default function Admin() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const growthData = [
    { name: 'Jan', users: 400, sessions: 240 },
    { name: 'Feb', users: 600, sessions: 380 },
    { name: 'Mar', users: 900, sessions: 520 },
    { name: 'Apr', users: 1200, sessions: 780 },
  ];

  const modelPerformance = [
    { name: 'Gemini 1.5 Flash', value: 85, color: '#3b82f6' },
    { name: 'Gemini 1.5 Pro', value: 15, color: '#8b5cf6' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    const isSystemAdmin = user.userRole === "admin" || user.email === "ekrashmurtaza@gmail.com";
    
    if (!isSystemAdmin) {
      toast.error("Access denied. Admins only.");
      navigate("/redirect");
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = () => {
    setIsLoading(true);
    try {
      const usersList = JSON.parse(localStorage.getItem("hirevision_users") || "[]");
      setUsers(usersList);

      const allInterviews = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]")
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setInterviews(allInterviews);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInterviews = interviews.filter(i => 
    i.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[120px] -z-10" />
      
      <BackButton />

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="ml-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-purple-600/10 text-purple-400 border border-purple-600/20 rounded-full text-[10px] font-black uppercase tracking-widest">Admin Control Center</span>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <h1 className="text-5xl font-black font-display tracking-tighter">System <span className="glow-text">Intelligence</span></h1>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary px-6 py-3 text-sm">
              <Download className="w-4 h-4" />
              Export Logs
            </button>
          </div>
        </header>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "CPU Usage", value: "12%", icon: Cpu, color: "text-blue-400", status: "Optimal", trend: "-2%" },
            { label: "Memory", value: "2.4GB", icon: Database, color: "text-purple-400", status: "Healthy", trend: "+0.1GB" },
            { label: "Active Users", value: users.length, icon: Users, color: "text-emerald-400", status: "Live", trend: "+12" },
            { label: "API Latency", value: "180ms", icon: Activity, color: "text-amber-400", status: "Stable", trend: "-15ms" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="glass-card p-6 border-white/5 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <stat.icon className="w-20 h-20" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{stat.status}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${stat.trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                </div>
              </div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
              <p className="text-3xl font-black font-display relative z-10 tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Growth Chart */}
          <div className="lg:col-span-2 glass-card p-8 group">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black flex items-center gap-3 font-display uppercase tracking-widest">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                User Growth & Sessions
              </h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" /> Users
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" /> Sessions
                </span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#444" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis stroke="#444" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="sessions" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Model Breakdown */}
          <div className="glass-card p-8 group">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 font-display uppercase tracking-widest">
              <Zap className="w-5 h-5 text-amber-400" />
              AI Model Usage
            </h3>
            <div className="h-[250px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modelPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {modelPerformance.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="font-black text-blue-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Logs & User Management */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 glass-card p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex gap-4">
                {["Users", "Interviews", "Logs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      activeTab === tab.toLowerCase() ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-neutral-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {activeTab === "users" ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">User</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Role</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Email</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.uid} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center font-black text-blue-400">
                              {user.name?.charAt(0) || "U"}
                            </div>
                            <p className="font-black text-sm tracking-tight">{user.name}</p>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            user.userRole === "admin" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          )}>
                            {user.userRole}
                          </span>
                        </td>
                        <td className="py-6 text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                          {user.email}
                        </td>
                        <td className="py-6">
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : activeTab === "interviews" ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Candidate</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Role</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Score</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInterviews.map((interview) => (
                      <tr key={interview.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center font-black text-blue-400">
                              {interview.userName?.charAt(0)}
                            </div>
                            <p className="font-black text-sm tracking-tight">{interview.userName}</p>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {interview.role}
                          </span>
                        </td>
                        <td className="py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500" 
                                style={{ width: `${interview.score}%` }}
                              />
                            </div>
                            <span className="font-black text-sm">{interview.score}%</span>
                          </div>
                        </td>
                        <td className="py-6 text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                          {new Date(interview.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="space-y-4">
                  {[
                    { type: "AUTH", msg: "User login successful: ekrashmurtaza@gmail.com", time: "2 mins ago", status: "success" },
                    { type: "AI", msg: "Gemini 1.5 Flash: Response generated for session #829", time: "5 mins ago", status: "info" },
                    { type: "SYSTEM", msg: "Database backup completed successfully", time: "15 mins ago", status: "success" },
                    { type: "AUTH", msg: "Failed login attempt from IP 192.168.1.1", time: "22 mins ago", status: "warning" },
                    { type: "AI", msg: "Behavioral analysis failed for session #828: INVALID_ARGUMENT", time: "45 mins ago", status: "error" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.05] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          log.status === "success" ? "bg-emerald-500" :
                          log.status === "error" ? "bg-rose-500" :
                          log.status === "warning" ? "bg-amber-500" : "bg-blue-500"
                        )} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-1">{log.type}</p>
                          <p className="text-sm font-medium text-neutral-300">{log.msg}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">{log.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 font-display uppercase tracking-widest">
              <Shield className="w-5 h-5 text-purple-400" />
              Security Audit
            </h3>
            <div className="space-y-6">
              {[
                { label: "Firewall", status: "Active", color: "text-emerald-500" },
                { label: "SSL Status", status: "Valid", color: "text-emerald-500" },
                { label: "Intrusion Detection", status: "Monitoring", color: "text-blue-500" },
                { label: "Data Encryption", status: "AES-256", color: "text-emerald-500" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-500">{item.label}</span>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Run Full Security Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
