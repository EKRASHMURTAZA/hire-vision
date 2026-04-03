import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Briefcase, Activity, Shield, 
  Search, Filter, MoreVertical, 
  ArrowUpRight, ArrowDownRight, 
  Zap, Database, Globe, Cpu,
  Server, Lock, AlertTriangle,
  CheckCircle2, Clock, Terminal,
  LayoutDashboard, Settings, LogOut,
  BarChart3, PieChart, LineChart,
  UserPlus, MessageSquare, FileText,
  Loader2, RefreshCw, Trash2, Edit2,
  Eye, Download, Share2, Plus,
  ChevronRight, ChevronDown, Bell,
  Search as SearchIcon, Menu, X,
  User
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart as ReLineChart, 
  Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell
} from "recharts";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1248,
    activeInterviews: 42,
    avgScore: 78.5,
    systemUptime: "99.99%",
    cpuUsage: 24,
    memoryUsage: 42,
    storageUsage: 18,
    networkLatency: "12ms"
  });

  const [users, setUsers] = useState([
    { id: 1, name: "Murtaza", email: "ekrashmurtaza@gmail.com", role: "Admin", status: "Active", lastLogin: "2 mins ago", interviews: 12 },
    { id: 2, name: "John Doe", email: "john@example.com", role: "User", status: "Active", lastLogin: "1 hour ago", interviews: 5 },
    { id: 3, name: "Sarah Smith", email: "sarah@example.com", role: "User", status: "Inactive", lastLogin: "2 days ago", interviews: 8 },
    { id: 4, name: "Alex Johnson", email: "alex@example.com", role: "User", status: "Active", lastLogin: "5 mins ago", interviews: 3 },
    { id: 5, name: "Emma Wilson", email: "emma@example.com", role: "User", status: "Active", lastLogin: "10 mins ago", interviews: 15 },
  ]);

  const [logs, setLogs] = useState([
    { id: 1, type: "info", message: "New user registered: Murtaza", time: "11:25:04", status: "success" },
    { id: 2, type: "warning", message: "High CPU usage detected on Node-04", time: "11:24:58", status: "warning" },
    { id: 3, type: "error", message: "Failed login attempt from 192.168.1.1", time: "11:23:12", status: "error" },
    { id: 4, type: "info", message: "System backup completed successfully", time: "11:20:00", status: "success" },
    { id: 5, type: "security", message: "Firewall rules updated", time: "11:15:45", status: "info" },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("hirevision_user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black font-display text-white tracking-tighter mb-2">Initializing Neural Core</h2>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-slate-900/50 border-r border-white/5 backdrop-blur-xl flex flex-col z-50 relative"
      >
        <div className="p-6 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black font-display tracking-tighter text-white"
            >
              HIRE<span className="text-blue-500">VISION</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Users className="w-5 h-5" />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Briefcase className="w-5 h-5" />} label="Interviews" active={activeTab === "interviews"} onClick={() => setActiveTab("interviews")} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Activity className="w-5 h-5" />} label="System Health" active={activeTab === "health"} onClick={() => setActiveTab("health")} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Shield className="w-5 h-5" />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Settings className="w-5 h-5" />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] -z-10" />
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black font-display text-white uppercase tracking-widest">
              Admin <span className="text-blue-500">Dashboard</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-2 pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
              />
            </div>
            <button className="relative p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white">Murtaza</p>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20">
                <User className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value={stats.totalUsers} trend="+12%" positive={true} color="blue" />
                  <StatCard icon={<Briefcase className="w-6 h-6" />} label="Active Interviews" value={stats.activeInterviews} trend="+5" positive={true} color="indigo" />
                  <StatCard icon={<Activity className="w-6 h-6" />} label="Avg. Score" value={`${stats.avgScore}%`} trend="-2%" positive={false} color="emerald" />
                  <StatCard icon={<Clock className="w-6 h-6" />} label="System Uptime" value={stats.systemUptime} trend="Stable" positive={true} color="amber" />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-lg font-black text-white">Interview Activity</h3>
                        <p className="text-xs text-slate-500 font-medium">Daily simulation volume across the network</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">7 Days</button>
                        <button className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">30 Days</button>
                      </div>
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-8">
                    <h3 className="text-lg font-black text-white mb-8">User Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-4">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-white">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System Health Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3 glass-card p-8">
                    <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Real-time System Logs
                    </h3>
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              log.status === "success" ? "bg-emerald-500/10 text-emerald-500" :
                              log.status === "warning" ? "bg-amber-500/10 text-amber-500" :
                              "bg-rose-500/10 text-rose-500"
                            )}>
                              {log.status === "success" ? <CheckCircle2 className="w-5 h-5" /> :
                               log.status === "warning" ? <AlertTriangle className="w-5 h-5" /> :
                               <Lock className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-xs font-black text-white">{log.message}</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.type} • {log.time}</p>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-8 space-y-8">
                    <h3 className="text-lg font-black text-white mb-2">Resource Usage</h3>
                    <UsageBar label="CPU Load" value={stats.cpuUsage} color="blue" />
                    <UsageBar label="Memory" value={stats.memoryUsage} color="indigo" />
                    <UsageBar label="Storage" value={stats.storageUsage} color="emerald" />
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Network Latency</span>
                        <span className="text-xs font-black text-emerald-500">{stats.networkLatency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Nodes</span>
                        <span className="text-xs font-black text-white">12 / 12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-white">User Management</h3>
                    <p className="text-xs text-slate-500 font-medium">Manage and monitor all platform participants</p>
                  </div>
                  <button className="btn-primary px-6 py-3 text-sm">
                    <UserPlus className="w-4 h-4" />
                    Add New User
                  </button>
                </div>

                <div className="glass-card overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">User</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Role</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Interviews</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Last Login</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20 text-blue-400 font-black">
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-black text-white">{user.name}</p>
                                <p className="text-[10px] font-black text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                              user.role === "Admin" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                            )}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full", user.status === "Active" ? "bg-emerald-500" : "bg-slate-500")} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.status}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-xs font-black text-white">{user.interviews}</span>
                          </td>
                          <td className="p-6">
                            <span className="text-xs font-black text-slate-500">{user.lastLogin}</span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, sidebarOpen }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group",
        active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white hover:bg-white/5"
      )}
    >
      <div className={cn("flex-shrink-0", active ? "text-white" : "text-slate-500 group-hover:text-blue-400 transition-colors")}>
        {icon}
      </div>
      {sidebarOpen && (
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      )}
      {active && sidebarOpen && (
        <motion.div layoutId="active-pill" className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full" />
      )}
    </button>
  );
}

function StatCard({ icon, label, value, trend, positive, color }: any) {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-600/10 border-blue-600/20",
    indigo: "text-indigo-400 bg-indigo-600/10 border-indigo-600/20",
    emerald: "text-emerald-400 bg-emerald-600/10 border-emerald-600/20",
    amber: "text-amber-400 bg-amber-600/10 border-amber-600/20",
  };

  return (
    <div className="glass-card p-6 group hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl border", colorMap[color])}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
          positive ? "text-emerald-500" : "text-rose-500"
        )}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</h4>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
    </div>
  );
}

function UsageBar({ label, value, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full rounded-full", colorMap[color])}
        />
      </div>
    </div>
  );
}

const chartData = [
  { name: "Mon", value: 45 },
  { name: "Tue", value: 52 },
  { name: "Wed", value: 48 },
  { name: "Thu", value: 61 },
  { name: "Fri", value: 55 },
  { name: "Sat", value: 67 },
  { name: "Sun", value: 72 },
];

const pieData = [
  { name: "Developers", value: 45 },
  { name: "Designers", value: 25 },
  { name: "Managers", value: 20 },
  { name: "Others", value: 10 },
];
