import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Shield, Calendar, 
  Settings, Camera, Edit3, Save, 
  LogOut, ChevronRight, Award, Briefcase,
  Globe, Zap, Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    location: "",
    skills: [] as string[],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setFormData({
        name: u.name || "",
        email: u.email || "",
        role: u.role || "Candidate",
        bio: u.bio || "Passionate professional looking for new opportunities.",
        location: u.location || "Global",
        skills: u.skills || ["React", "AI", "Communication"],
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("hirevision_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleSignOut = () => {
    localStorage.removeItem("hirevision_user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] -z-10" />
      
      <div className="max-w-5xl mx-auto px-8 py-16 relative">
        <BackButton />
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="ml-12">
            <h1 className="text-5xl font-black font-display tracking-tighter text-white">Your <span className="text-blue-500">Profile</span></h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-2">Manage your professional identity</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary px-6 py-3 text-sm"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
            <button 
              onClick={handleSignOut}
              className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <User className="w-32 h-32 text-white" />
              </div>
              
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-600/20 shadow-2xl overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-blue-400" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-black font-display tracking-tight text-white mb-1">{formData.name}</h2>
              <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">{formData.role}</p>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">{formData.location}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">Account Type: {user.userRole || "User"}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {skill}
                  </span>
                ))}
                {isEditing && (
                  <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10">
              <h3 className="text-xl font-black font-display uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Professional Summary
              </h3>
              {isEditing ? (
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-3xl p-6 text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              ) : (
                <p className="text-slate-400 leading-relaxed font-medium text-lg italic">
                  "{formData.bio}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-600/10 rounded-2xl">
                    <Award className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                </div>
                <h4 className="text-lg font-black text-white mb-2">Interview History</h4>
                <p className="text-xs text-slate-500 font-medium mb-6">You have completed 12 AI simulations with an average score of 84%.</p>
                <button 
                  onClick={() => navigate("/history")}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                  View All Results <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="glass-card p-8 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-600/10 rounded-2xl">
                    <Briefcase className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active</span>
                </div>
                <h4 className="text-lg font-black text-white mb-2">Resume Builder</h4>
                <p className="text-xs text-slate-500 font-medium mb-6">Create a high-level professional resume using our neural generation engine.</p>
                <button 
                  onClick={() => navigate("/resume-builder")}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                  Generate Resume <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="glass-card p-10">
              <h3 className="text-xl font-black font-display uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-400" />
                Account Settings
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Email Notifications", status: "Enabled", color: "text-emerald-500" },
                  { label: "Public Profile", status: "Disabled", color: "text-slate-500" },
                  { label: "AI Feedback Level", status: "Advanced", color: "text-blue-500" },
                  { label: "Two-Factor Auth", status: "Enabled", color: "text-emerald-500" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
