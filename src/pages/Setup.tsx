import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, User, Briefcase, FileText, ArrowRight, Globe, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

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
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12 text-center">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 w-24 rounded-full transition-all duration-500 ${s <= step ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "bg-white/10"}`} 
            />
          ))}
        </div>
        <h2 className="text-5xl font-bold mb-4 glow-text">
          {step === 1 ? "Personalize Your Experience" : "Analyze Your Potential"}
        </h2>
        <p className="text-neutral-400 text-lg">
          {step === 1 ? "Help us tailor the interview to your specific career path." : "Our AI will scan your resume to craft the perfect challenge."}
        </p>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10"
      >
        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-input w-full"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Target Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="glass-input w-full appearance-none"
              >
                <option value="" className="bg-neutral-900">Select Role</option>
                <option value="Software Engineer" className="bg-neutral-900">Software Engineer</option>
                <option value="Frontend Developer" className="bg-neutral-900">Frontend Developer</option>
                <option value="Backend Developer" className="bg-neutral-900">Backend Developer</option>
                <option value="Full Stack Developer" className="bg-neutral-900">Full Stack Developer</option>
                <option value="Data Scientist" className="bg-neutral-900">Data Scientist</option>
                <option value="DevOps Engineer" className="bg-neutral-900">DevOps Engineer</option>
                <option value="Product Manager" className="bg-neutral-900">Product Manager</option>
                <option value="UI/UX Designer" className="bg-neutral-900">UI/UX Designer</option>
                <option value="QA Engineer" className="bg-neutral-900">QA Engineer</option>
                <option value="Mobile Developer" className="bg-neutral-900">Mobile Developer</option>
                <option value="Cloud Architect" className="bg-neutral-900">Cloud Architect</option>
                <option value="Cybersecurity Analyst" className="bg-neutral-900">Cybersecurity Analyst</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Experience
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="glass-input w-full appearance-none"
              >
                <option value="" className="bg-neutral-900">Select Experience</option>
                <option value="entry" className="bg-neutral-900">Entry Level (0-2 years)</option>
                <option value="mid" className="bg-neutral-900">Mid Level (3-5 years)</option>
                <option value="senior" className="bg-neutral-900">Senior Level (5+ years)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="glass-input w-full appearance-none"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} className="bg-neutral-900">{lang}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer ${
                isDragActive ? "border-blue-600 bg-blue-600/5" : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/10">
                <Upload className="text-blue-400 w-10 h-10" />
              </div>
              {formData.resume ? (
                <div>
                  <p className="text-xl font-bold text-white mb-2">{formData.resume.name}</p>
                  <p className="text-sm text-neutral-500">Click or drag to replace your resume</p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-bold text-white mb-2">Drop your resume here</p>
                  <p className="text-sm text-neutral-500">PDF, DOC, DOCX up to 5MB</p>
                </div>
              )}
            </div>

            {isAnalyzingResume && (
              <div className="flex items-center justify-center gap-3 text-blue-400 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-bold uppercase tracking-widest text-xs">AI Analyzing Resume...</span>
              </div>
            )}

            {resumeAnalysis && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex gap-4"
              >
                <Sparkles className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">AI Insight</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">{resumeAnalysis}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={isSaving}
          className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 group"
        >
          {isSaving ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {step === 1 ? "Continue to Analysis" : "Launch Neural Interview"}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
