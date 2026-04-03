import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Sparkles, Download, 
  ChevronRight, ArrowLeft, Loader2,
  User, Briefcase, GraduationCap, 
  Wrench, Globe, Mail, Phone, MapPin,
  CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { interviewService } from "../lib/ai";
import BackButton from "../components/BackButton";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    experience: "",
    education: "",
    skills: "",
    achievements: "",
    language: "English"
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        name: u.name || "",
        email: u.email || "",
      }));
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await interviewService.generateResume(formData, formData.language);
      if (result) {
        setResume(result);
        setStep(3);
        toast.success("Professional resume generated!");
      } else {
        toast.error("Failed to generate resume. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([resume.markdown], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${formData.name.replace(/\s+/g, '_')}_Resume.md`;
    document.body.appendChild(element);
    element.click();
    toast.success("Resume downloaded as Markdown!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] -z-10" />
      
      <div className="max-w-4xl mx-auto px-8 py-16 relative">
        <BackButton />
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="ml-12">
            <h1 className="text-5xl font-black font-display tracking-tighter text-white">Neural <span className="text-blue-500">Resume</span></h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-2">AI-Powered Professional Identity Generation</p>
          </div>
          {step === 3 && (
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="btn-secondary px-6 py-3 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Edit Data
              </button>
              <button 
                onClick={handleDownload}
                className="btn-primary px-6 py-3 text-sm"
              >
                <Download className="w-4 h-4" />
                Download MD
              </button>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-600/20 shadow-2xl mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-black font-display tracking-tight text-white mb-4">Ready to build your career?</h2>
              <p className="text-slate-400 font-medium text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Our advanced neural engine will analyze your data and generate a high-level professional resume optimized for modern hiring systems.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="btn-primary px-10 py-5 text-lg group"
              >
                Start Building <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Personal Information
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Full Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} icon={<User className="w-4 h-4" />} />
                    <InputField label="Email Address" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} icon={<Mail className="w-4 h-4" />} />
                    <InputField label="Phone Number" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} icon={<Phone className="w-4 h-4" />} />
                    <InputField label="Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} icon={<MapPin className="w-4 h-4" />} />
                  </div>
                </div>

                <div className="glass-card p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" /> Professional Details
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Target Role" value={formData.role} onChange={(v) => setFormData({...formData, role: v})} icon={<Briefcase className="w-4 h-4" />} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Language</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                      >
                        <option value="English">English</option>
                        <option value="Urdu">Urdu (اردو)</option>
                        <option value="Hindi">Hindi (हिन्दी)</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Experience & Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextAreaField label="Work Experience" value={formData.experience} onChange={(v) => setFormData({...formData, experience: v})} placeholder="List your previous roles and key responsibilities..." />
                  <TextAreaField label="Education" value={formData.education} onChange={(v) => setFormData({...formData, education: v})} placeholder="List your degrees, certifications, and institutions..." />
                </div>
              </div>

              <div className="glass-card p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" /> Skills & Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextAreaField label="Technical Skills" value={formData.skills} onChange={(v) => setFormData({...formData, skills: v})} placeholder="React, Node.js, Python, AI, etc..." />
                  <TextAreaField label="Key Achievements" value={formData.achievements} onChange={(v) => setFormData({...formData, achievements: v})} placeholder="Projects, awards, or significant impacts..." />
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn-primary px-12 py-5 text-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating Resume...
                    </>
                  ) : (
                    <>
                      Generate Professional Resume
                      <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && resume && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="glass-card p-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">AI Summary</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">"{resume.summary}"</p>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">Suggested Roles</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.suggestedRoles.map((role: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">ATS Optimized</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium">This resume is structured to pass through modern Applicant Tracking Systems with ease.</p>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="glass-card p-12 bg-white/[0.01] border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                      <FileText className="w-64 h-64 text-white" />
                    </div>
                    <div className="prose prose-invert prose-slate max-w-none relative">
                      <ReactMarkdown>{resume.markdown}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          placeholder={`Enter your ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
        placeholder={placeholder}
      />
    </div>
  );
}
