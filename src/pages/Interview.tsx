import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, MicOff, Video, VideoOff, Send, 
  Brain, Target, Activity, AlertCircle, CheckCircle2,
  ChevronRight, Loader2, BarChart3, Globe, Shirt,
  Clock, Sparkles, Zap, MessageSquare, Shield
} from "lucide-react";
import { toast } from "react-hot-toast";
import { interviewService } from "../lib/ai";
import { cn } from "../lib/utils";
import AIAvatar from "../components/AIAvatar";
import AIFace from "../components/AIFace";
import BackButton from "../components/BackButton";
import LiveInterviewer from "../components/LiveInterviewer";

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Urdu", name: "Urdu" },
  { code: "Hindi", name: "Hindi" },
  { code: "Spanish", name: "Spanish" },
  { code: "French", name: "French" },
  { code: "German", name: "German" },
  { code: "Chinese", name: "Chinese" },
  { code: "Arabic", name: "Arabic" },
];

export default function Interview() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [language, setLanguage] = useState("English");
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string; analysis?: any }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [dressingInfo, setDressingInfo] = useState<any>(null);
  const [isAnalyzingDressing, setIsAnalyzingDressing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [profile, setProfile] = useState<any>({});

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (!storedUser) navigate("/login");
  }, [navigate]);
  
  const [behavioralStats, setBehavioralStats] = useState({
    eyeContact: 85,
    handMovements: 70,
    facialExpressions: 75,
    engagement: 80,
    sentiment: "Neutral",
    energy: 90
  });
  const [behavioralInsight, setBehavioralInsight] = useState("");

  const updateBehavioralStats = () => {
    // Simulate real-time updates
    setBehavioralStats(prev => {
      // Ensure prev is never null
      const current = prev || {
        eyeContact: 85,
        handMovements: 70,
        facialExpressions: 75,
        engagement: 80,
        sentiment: "Neutral",
        energy: 90
      };
      return {
        ...current,
        eyeContact: Math.min(100, Math.max(0, current.eyeContact + (Math.random() * 10 - 5))),
        engagement: Math.min(100, Math.max(0, current.engagement + (Math.random() * 6 - 3))),
        energy: Math.min(100, Math.max(0, current.energy + (Math.random() * 4 - 2))),
      };
    });
  };

  useEffect(() => {
    const interval = setInterval(updateBehavioralStats, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(console.error);
          };
        }
      } catch (err) {
        toast.error("Could not access camera or microphone");
      }
    };

    const profileData = JSON.parse(localStorage.getItem("hirevision_profile") || "{}");
    setProfile(profileData);
    if (profileData.language) setLanguage(profileData.language);

    startMedia();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Ensure video stays connected if ref changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (language) {
      loadQuestions();
    }
  }, [language]);

  const loadQuestions = async () => {
    setIsGenerating(true);
    const profile = JSON.parse(localStorage.getItem("hirevision_profile") || "{}");
    try {
      const q = await interviewService.generateQuestions(profile, language);
      if (!q || q.length === 0) throw new Error("No questions generated");
      setQuestions(q);
      setCurrentIdx(0);
      setAnswers([]);
    } catch (err) {
      console.error("Question generation error:", err);
      toast.error("AI is busy. Using fallback questions.");
      const fallbacks: Record<string, string[]> = {
        "Urdu": ["اپنے بارے میں بتائیں۔", "آپ اس رول کے لیے کیوں موزوں ہیں؟"],
        "Hindi": ["अपने बारे में बताएं।", "आप इस भूमिका के लिए क्यों उपयुक्त हैं?"],
        "Spanish": ["Háblame de ti.", "¿Por qué quieres este puesto?"],
        "French": ["Parlez-moi de vous.", "Pourquoi voulez-vous ce poste ?"],
        "German": ["Erzählen Sie mir etwas über sich.", "Warum wollen Sie diese Stelle?"],
        "Chinese": ["请自我介绍。", "你为什么要申请这个职位？"],
        "Arabic": ["أخبرني عن نفسك.", "لماذا تريد هذا المنصب؟"]
      };
      setQuestions(fallbacks[language] || ["Tell me about yourself.", "Why do you want this role?"]);
      setCurrentIdx(0);
      setAnswers([]);
    } finally {
      setIsGenerating(false);
    }
  };

  // TTS for questions
  useEffect(() => {
    if (questions.length > 0 && !isGenerating) {
      speakQuestion(questions[currentIdx]);
    }
  }, [currentIdx, questions, isGenerating]);

  const speakQuestion = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const langMap: Record<string, string> = {
      "English": "en-US",
      "Urdu": "ur-PK",
      "Hindi": "hi-IN",
      "Spanish": "es-ES",
      "French": "fr-FR",
      "German": "de-DE",
      "Chinese": "zh-CN",
      "Arabic": "ar-SA"
    };
    
    const targetLang = langMap[language] || "en-US";
    utterance.lang = targetLang;
    
    // Try to find a high-quality voice
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.startsWith(targetLang.split("-")[0]));
    
    // Fallback for Urdu: Hindi voices are often better for pronunciation if Urdu is missing
    if (!voice && language === "Urdu") {
      voice = voices.find(v => v.lang.startsWith("hi"));
    }
    
    if (voice) utterance.voice = voice;

    // Adjust for better Urdu pronunciation
    if (language === "Urdu") {
      utterance.rate = 0.75; // Even slower for better clarity
      utterance.pitch = 1.1; // Slightly higher for natural tone
    } else {
      utterance.rate = 1;
      utterance.pitch = 1;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const captureFrame = (video: HTMLVideoElement): string | null => {
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement("canvas");
    const maxDim = 640;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > height) {
      if (width > maxDim) {
        height *= maxDim / width;
        width = maxDim;
      }
    } else {
      if (height > maxDim) {
        width *= maxDim / height;
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
  };

  // Visual Analysis (Dressing)
  const analyzeDressing = async () => {
    if (!videoRef.current || isAnalyzingDressing) return;
    
    const base64 = captureFrame(videoRef.current);
    if (!base64) return;

    setIsAnalyzingDressing(true);
    try {
      const result = await interviewService.analyzeDressing(base64, language);
      setDressingInfo(result);
      if (result.isFormal) {
        toast.success("Professional attire detected!");
      } else {
        toast.error("Casual attire detected. Try to wear formal clothes.");
      }
    } catch (err) {
      console.error("Dressing analysis failed", err);
    } finally {
      setIsAnalyzingDressing(false);
    }
  };

  // Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer(transcript);

        // Check for "Done" keyword to auto-submit
        if (transcript.toLowerCase().includes("done") || transcript.toLowerCase().includes("ختم") || transcript.toLowerCase().includes("مکمل")) {
          const cleanTranscript = transcript.replace(/done|ختم|مکمل/gi, "").trim();
          if (cleanTranscript) {
            setCurrentAnswer(cleanTranscript);
            handleNext(cleanTranscript);
            recognitionRef.current?.stop();
            setIsListening(false);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === "no-speech") {
          // Silently handle no-speech to avoid annoying the user
          console.log("Speech recognition: no speech detected");
        } else {
          console.error("Speech recognition error", event.error);
          toast.error(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };
    }
  }, [currentIdx, questions, language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  // Behavioral Analysis Loop
  useEffect(() => {
    let interval: any;
    if (stream && isVideoOn && !isAnalyzing && !isGenerating) {
      interval = setInterval(() => {
        captureAndAnalyzeBehavior();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [stream, isVideoOn, isAnalyzing, isGenerating]);

  const captureAndAnalyzeBehavior = async () => {
    if (!videoRef.current) return;
    
    const base64 = captureFrame(videoRef.current);
    if (!base64) return;

    try {
      const result = await interviewService.analyzeBehavior(base64, language);
      if (result && typeof result === 'object') {
        setBehavioralStats(prev => {
          const current = prev || {
            eyeContact: 50,
            handMovements: 50,
            facialExpressions: 50,
            engagement: 50,
            sentiment: "Neutral",
            energy: 50
          };
          return {
            ...current,
            eyeContact: result.eyeContact ?? current.eyeContact ?? 50,
            handMovements: result.handMovements ?? current.handMovements ?? 50,
            facialExpressions: result.facialExpressions ?? current.facialExpressions ?? 50,
            engagement: Math.round(((result.eyeContact ?? 50) + (result.handMovements ?? 50) + (result.facialExpressions ?? 50)) / 3)
          };
        });
        setBehavioralInsight(result.comment || (language === "Urdu" ? "تجزیہ جاری ہے..." : "Analyzing behavior..."));
      }
    } catch (err) {
      console.error("Behavioral analysis failed", err);
    }
  };

  const handleNext = async (overrideAnswer?: string) => {
    const answerToAnalyze = overrideAnswer || currentAnswer;
    if (!answerToAnalyze.trim()) {
      toast.error("Please provide an answer first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await interviewService.analyzeAnswer(questions[currentIdx], answerToAnalyze, language);
      const newAnswers = [...answers, { question: questions[currentIdx], answer: answerToAnalyze, analysis }];
      setAnswers(newAnswers);
      
      // AI speaks feedback
      if (analysis.feedback) {
        speakQuestion(analysis.feedback);
      }

      if (currentIdx < questions.length - 1) {
        // Wait for feedback to finish speaking before moving to next question
        setTimeout(() => {
          setCurrentIdx(currentIdx + 1);
          setCurrentAnswer("");
        }, 3000);
      } else {
        setIsSaving(true);
        const finalScore = Math.round(newAnswers.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0) / newAnswers.length);
        const profile = JSON.parse(localStorage.getItem("hirevision_profile") || "{}");
        const storedUser = localStorage.getItem("hirevision_user");

        if (storedUser) {
          const user = JSON.parse(storedUser);
          const interviewData = {
            id: Math.random().toString(36).substring(2, 15),
            userId: user.uid,
            userName: profile.name || user.name,
            role: profile.role,
            date: new Date().toISOString(),
            score: finalScore,
            results: newAnswers,
            dressing: dressingInfo,
            behavior: behavioralStats,
            language: language
          };

          const interviews = JSON.parse(localStorage.getItem("hirevision_interviews") || "[]");
          interviews.push(interviewData);
          localStorage.setItem("hirevision_interviews", JSON.stringify(interviews));
        }

        localStorage.setItem("hirevision_results", JSON.stringify(newAnswers));
        localStorage.setItem("hirevision_dressing", JSON.stringify(dressingInfo));
        localStorage.setItem("hirevision_behavior", JSON.stringify(behavioralStats));
        
        if (finalScore >= 80) {
          toast.success("CONGRATULATIONS! You'll get the job!", { duration: 5000 });
        }
        
        navigate("/report");
      }
    } catch (err) {
      toast.error("Analysis failed, moving to next question");
      setCurrentIdx(currentIdx + 1);
      setCurrentAnswer("");
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 relative bg-slate-950">
        <BackButton />
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-lg shadow-blue-500/20" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 w-10 h-10" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black font-display mb-2 tracking-tight text-white">AI is Preparing Your <span className="text-blue-500">Interview</span></h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Analyzing your profile and generating tailored questions in {language}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] -z-10" />
      
      <BackButton />

      {/* Header */}
      <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-6 ml-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Brain className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black font-display tracking-tight text-white">Neural <span className="text-blue-500">Interview</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Simulation Mode</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
            <button
              onClick={() => setIsLiveMode(false)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                !isLiveMode ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Standard
            </button>
            <button
              onClick={() => setIsLiveMode(true)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                isLiveMode ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Zap className="w-3 h-3" />
              Live AI (Era)
            </button>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Question {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-black font-mono tracking-widest text-white">{formatTime(timer)}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-[1800px] mx-auto w-full overflow-hidden">
        {/* Left: AI Avatar & Question */}
        <div className="flex-[2] flex flex-col gap-6 min-w-0">
          {isLiveMode ? (
            <div className="flex-1 flex flex-col gap-6">
              <LiveInterviewer 
                language={language} 
                profile={profile}
                onTranscript={(text, role) => {
                  if (role === "model") setTranscript(text);
                }}
              />
              <div className="glass-card p-6 flex-1 overflow-y-auto max-h-[300px]">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Conversation</span>
                </div>
                <div className="space-y-3">
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl text-sm leading-relaxed text-slate-300"
                    >
                      {transcript}
                    </motion.div>
                  )}
                  <p className="text-xs text-slate-600 italic">Era is listening to your responses in real-time...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="glass-card flex-1 p-8 flex flex-col justify-center items-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Brain className="w-32 h-32 text-white" />
                </div>

                <div className="mb-8">
                  <AIFace isSpeaking={isSpeaking} isListening={isListening} />
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="relative z-10"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                      <Target className="w-3 h-3" />
                      Current Question ({language})
                    </div>
                    <h2 className={cn(
                      "text-3xl md:text-4xl font-black font-display leading-tight tracking-tight mb-8 text-white",
                      language === "Urdu" || language === "Arabic" ? "text-right font-urdu" : "text-left"
                    )}>
                      {questions[currentIdx]}
                    </h2>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Behavioral Focus</span>
                      </div>
                      <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adaptive Difficulty</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Response Area */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full animate-pulse",
                      isListening ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-slate-700"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {isListening ? "Listening..." : "Microphone Standby"}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    value={transcript || currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Your answer will appear here as you speak..."
                    className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={toggleListening}
                    className={cn(
                      "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                      isListening 
                        ? "bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600/20" 
                        : "btn-primary bg-blue-600"
                    )}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isListening ? "Stop" : "Start Speaking"}
                  </button>
                  <button
                    onClick={() => handleNext()}
                    disabled={isAnalyzing || (!currentAnswer && !transcript)}
                    className="btn-primary py-4"
                  >
                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {currentIdx === questions.length - 1 ? "Finish" : "Submit"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Camera & Analysis HUD */}
        <div className="flex-1 flex flex-col gap-6 min-w-[350px]">
          <div className="glass-card overflow-hidden relative aspect-square group">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn("w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700", !isVideoOn && "opacity-0")}
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <VideoOff className="w-16 h-16 text-slate-700" />
              </div>
            )}
            
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500/50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/50" />
              
              {/* Scanning Line */}
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
              />

              {/* HUD Data */}
              <div className="absolute top-8 left-8 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 drop-shadow-lg">Face Tracking Active</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Confidence Index</p>
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["60%", "85%", "75%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Attire Score</p>
                <p className="text-3xl font-black font-display text-blue-400">{dressingInfo?.score || "--"}%</p>
                <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1">Professional</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/70 transition-all text-white"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-500" />}
              </button>
              <button 
                onClick={analyzeDressing}
                disabled={isAnalyzingDressing}
                className="p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/70 transition-all text-white"
              >
                {isAnalyzingDressing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shirt className="w-5 h-5 text-blue-400" />}
              </button>
            </div>
          </div>

          <div className="glass-card p-6 flex-1">
            <h3 className="text-sm font-black mb-4 flex items-center gap-3 font-display uppercase tracking-widest text-white">
              <Activity className="w-4 h-4 text-blue-400" />
              Live Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Eye Contact", val: `${Math.round(behavioralStats.eyeContact)}%`, icon: Target, color: "text-blue-400" },
                { label: "Engagement", val: `${Math.round(behavioralStats.engagement)}%`, icon: Activity, color: "text-indigo-400" },
                { label: "Energy", val: `${Math.round(behavioralStats.energy)}%`, icon: Zap, color: "text-blue-400" },
                { label: "Sentiment", val: behavioralStats.sentiment, icon: MessageSquare, color: "text-slate-400" },
              ].map((metric, i) => (
                <div key={i} className="flex flex-col p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <metric.icon className={cn("w-3 h-3", metric.color)} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                  </div>
                  <span className="text-xs font-black text-white">{metric.val}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">AI Insight</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Era suggests: Maintain consistent eye contact for better engagement.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Analysis Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-8"
          >
            <div className="max-w-md w-full text-center">
              <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                <Brain className="w-12 h-12 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-3xl animate-spin" />
              </div>
              <h2 className="text-3xl font-black font-display mb-4 text-blue-400">Analyzing Performance</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Our neural network is evaluating your response, tone, and behavioral cues...
              </p>
              <div className="mt-12 flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <div className="mt-8 space-y-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  />
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Processing Neural Weights</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
