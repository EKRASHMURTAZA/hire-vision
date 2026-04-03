import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, User, Briefcase, FileText, ArrowRight, Globe, Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

export default function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    language: "English",
    resume: null as File | null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        role: user.role || "",
        experience: user.experience || "",
        language: user.language || "English"
      }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Hindi", "Arabic", "Russian", "Portuguese", "Urdu", "Bengali"
  ];

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFormData({ ...formData, resume: file });
    toast.success("Resume uploaded successfully!");
    
    // Advanced Function: AI Resume Analysis
    setIsAnalyzingResume(true);
    try {
      // Mocking resume text extraction for now
      const analysis = "Your resume shows strong experience in React and Node.js. We recommend focusing on system design for your upcoming interview.";
      setResumeAnalysis(analysis);
      toast.success("AI Resume Analysis Complete!");
    } catch (error) {
      console.error("Resume analysis failed", error);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    multiple: false,
  });

  const handleNext = async () => {
    if (step === 1 && (!formData.name || !formData.role)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (step === 2 && !formData.resume) {
      toast.error("Please upload your resume");
      return;
    }
    if (step === 2) {
      setIsSaving(true);
      try {
        const storedUser = localStorage.getItem("hirevision_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = {
            ...user,
            name: formData.name,
            role: formData.role,
            experience: formData.experience,
            language: formData.language
          };
          localStorage.setItem("hirevision_user", JSON.stringify(updatedUser));
          
          // Update in users list too
          const users = JSON.parse(localStorage.getItem("hirevision_users") || "[]");
          const index = users.findIndex((u: any) => u.uid === user.uid);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("hirevision_users", JSON.stringify(users));
          }
        }
        localStorage.setItem("hirevision_profile", JSON.stringify(formData));
        navigate("/interview");
      } catch (error) {
        console.error("Error saving profile:", error);
        toast.error("Failed to save profile");
      } finally {
        setIsSaving(false);
      }
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] -z-10" />
      
      <div className="max-w-4xl mx-auto px-8 py-24 relative">
        <BackButton />
        
        <div className="mb-16 text-center">
          <div className="flex justify-center gap-3 mb-10">
            {[1, 2].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 w-32 rounded-full transition-all duration-700 ${s <= step ? "bg-blue-600 shadow-lg shadow-blue-600/20" : "bg-white/5"}`} 
              />
            ))}
          </div>
          <h2 className="text-5xl md:text-6xl font-black font-display mb-6 tracking-tight leading-none text-white">
            {step === 1 ? <>Personalize Your <span className='text-blue-500'>Experience</span></> : <>Analyze Your <span className='text-indigo-500'>Potential</span></>}
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            {step === 1 ? "Help us tailor the interview to your specific career path and expertise." : "Our AI will scan your resume to craft the perfect challenge for your skills."}
          </p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            {step === 1 ? <User className="w-40 h-40 text-white" /> : <FileText className="w-40 h-40 text-white" />}
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Target Role
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-white"
                  >
                    <option value="" className="bg-slate-900">Select Role</option>
                    <option value="Software Engineer" className="bg-slate-900">Software Engineer</option>
                    <option value="Frontend Developer" className="bg-slate-900">Frontend Developer</option>
                    <option value="Backend Developer" className="bg-slate-900">Backend Developer</option>
                    <option value="Full Stack Developer" className="bg-slate-900">Full Stack Developer</option>
                    <option value="Data Scientist" className="bg-slate-900">Data Scientist</option>
                    <option value="DevOps Engineer" className="bg-slate-900">DevOps Engineer</option>
                    <option value="Product Manager" className="bg-slate-900">Product Manager</option>
                    <option value="UI/UX Designer" className="bg-slate-900">UI/UX Designer</option>
                    <option value="QA Engineer" className="bg-slate-900">QA Engineer</option>
                    <option value="Mobile Developer" className="bg-slate-900">Mobile Developer</option>
                    <option value="Cloud Architect" className="bg-slate-900">Cloud Architect</option>
                    <option value="Cybersecurity Analyst" className="bg-slate-900">Cybersecurity Analyst</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" /> Experience
                </label>
                <div className="relative">
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-white"
                  >
                    <option value="" className="bg-slate-900">Select Experience</option>
                    <option value="entry" className="bg-slate-900">Entry Level (0-2 years)</option>
                    <option value="mid" className="bg-slate-900">Mid Level (3-5 years)</option>
                    <option value="senior" className="bg-slate-900">Senior Level (5+ years)</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> Interview Language
                </label>
                <div className="relative">
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-white"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10 relative z-10">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-[2.5rem] p-20 text-center transition-all cursor-pointer group/upload ${
                  isDragActive ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10" : "border-white/10 hover:border-blue-500/50 bg-white/[0.02]"
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover/upload:scale-110 transition-transform duration-500">
                  <Upload className={cn("w-10 h-10 transition-colors duration-500", isDragActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400")} />
                </div>
                {formData.resume ? (
                  <div>
                    <p className="text-2xl font-black font-display text-white mb-3">{formData.resume.name}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Click or drag to replace your resume</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-black font-display text-white mb-3">Drop your resume here</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">PDF, DOC, DOCX up to 5MB</p>
                  </div>
                )}
              </div>

              {isAnalyzingResume && (
                <div className="flex items-center justify-center gap-4 text-blue-400 animate-pulse">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">AI Analyzing Resume...</span>
                </div>
              )}

              {resumeAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] flex gap-6"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">AI Resume Insight</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{resumeAnalysis}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={isSaving}
            className="btn-primary w-full mt-12 py-6 flex items-center justify-center gap-4 text-lg group active:scale-[0.98]"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {step === 1 ? "Continue to Analysis" : "Launch Neural Interview"}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
