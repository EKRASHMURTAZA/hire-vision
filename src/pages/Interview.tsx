import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, MicOff, Video, VideoOff, Send, 
  Brain, Target, Activity, AlertCircle, CheckCircle2,
  ChevronRight, Loader2, BarChart3, Globe, Shirt
} from "lucide-react";
import { toast } from "react-hot-toast";
import { interviewService } from "../lib/gemini";
import { cn } from "../lib/utils";
import AIAvatar from "../components/AIAvatar";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (!storedUser) navigate("/login");
  }, [navigate]);
  
  const [behavioralStats, setBehavioralStats] = useState({
    eyeContact: 85,
    handMovements: 70,
    facialExpressions: 75,
    engagement: 80
  });
  const [behavioralInsight, setBehavioralInsight] = useState("");

  useEffect(() => {
    const startMedia = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        toast.error("Could not access camera or microphone");
      }
    };

    const profile = JSON.parse(localStorage.getItem("hirevision_profile") || "{}");
    if (profile.language) setLanguage(profile.language);

    startMedia();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

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
      setQuestions(q);
      setCurrentIdx(0);
      setAnswers([]);
    } catch (err) {
      toast.error("Failed to generate questions");
      setQuestions(["Tell me about yourself.", "Why do you want this role?", "What are your strengths?"]);
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
    utterance.lang = langMap[language] || "en-US";
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
      const result = await interviewService.analyzeDressing(base64);
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
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

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
      const result = await interviewService.analyzeBehavior(base64);
      setBehavioralStats({
        eyeContact: result.eyeContact,
        handMovements: result.handMovements,
        facialExpressions: result.facialExpressions,
        engagement: (result.eyeContact + result.handMovements + result.facialExpressions) / 3
      });
      setBehavioralInsight(result.comment);
    } catch (err) {
      console.error("Behavioral analysis failed", err);
    }
  };

  const handleNext = async () => {
    if (!currentAnswer.trim()) {
      toast.error("Please provide an answer first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await interviewService.analyzeAnswer(questions[currentIdx], currentAnswer, language);
      const newAnswers = [...answers, { question: questions[currentIdx], answer: currentAnswer, analysis }];
      setAnswers(newAnswers);
      
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setCurrentAnswer("");
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
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-10 h-10" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">AI is Preparing Your Interview</h2>
          <p className="text-neutral-400">Analyzing your profile and generating tailored questions in {language}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-950 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-neutral-950/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm">HireVision AI Interview</h1>
            <p className="text-xs text-neutral-500">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none"
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-neutral-900">{l.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-medium animate-pulse">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            LIVE ANALYSIS
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        {/* Left: AI Avatar & Stats */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="relative flex-1">
            <AIAvatar isSpeaking={isSpeaking} score={answers[answers.length - 1]?.analysis?.score || 70} />
            
            {/* Real-time Score HUD */}
            <div className="absolute top-6 right-6 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Live Score</div>
              <div className={cn(
                "text-3xl font-black",
                (answers[answers.length - 1]?.analysis?.score || 0) > 70 ? "text-emerald-400" : (answers[answers.length - 1]?.analysis?.score || 0) > 40 ? "text-blue-400" : "text-red-400"
              )}>
                {answers[answers.length - 1]?.analysis?.score || "--"}
              </div>
            </div>
          </div>

          {/* Real-time Insights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Target, label: "Eye Contact", val: behavioralStats.eyeContact, color: "text-blue-400" },
              { icon: Brain, label: "Hands", val: behavioralStats.handMovements, color: "text-purple-400" },
              { icon: BarChart3, label: "Expressions", val: behavioralStats.facialExpressions, color: "text-emerald-400" },
              { icon: Shirt, label: "Dressing", val: dressingInfo?.score || 0, color: "text-amber-400", action: analyzeDressing, loading: isAnalyzingDressing }
            ].map((insight, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl relative group">
                <div className="flex items-center gap-2 mb-2">
                  <insight.icon className={cn("w-4 h-4", insight.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{insight.label}</span>
                </div>
                <div className="text-xl font-bold">
                  {insight.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (insight.val === 0 ? "--" : `${Math.round(insight.val)}%`)}
                </div>
                {insight.action && (
                  <button 
                    onClick={insight.action}
                    className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Activity className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: User Video & Interaction */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6">
          {/* User Video Feed */}
          <div className="relative h-64 bg-neutral-900 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={cn("w-full h-full object-cover transition-opacity duration-500", !isVideoOn && "opacity-0")}
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                <VideoOff className="w-12 h-12 text-neutral-600" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={cn("p-2 rounded-lg transition-all", isMicOn ? "bg-black/40 backdrop-blur-md" : "bg-red-500/20 text-red-500")}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={cn("p-2 rounded-lg transition-all", isVideoOn ? "bg-black/40 backdrop-blur-md" : "bg-red-500/20 text-red-500")}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Interaction Panel */}
          <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Interviewer</h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-medium leading-relaxed"
                >
                  {questions[currentIdx]}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Your Response</div>
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-white/5 text-neutral-500 hover:bg-white/10"
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", isListening ? "bg-red-500" : "bg-neutral-500")} />
                  {isListening ? "Listening..." : "Voice Input"}
                </button>
              </div>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here or speak..."
                className="w-full h-full bg-transparent resize-none focus:outline-none text-neutral-300 leading-relaxed"
              />
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/10">
              <button
                onClick={handleNext}
                disabled={isAnalyzing}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Response...
                  </>
                ) : (
                  <>
                    {currentIdx === questions.length - 1 ? "Finish Interview" : "Next Question"}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
