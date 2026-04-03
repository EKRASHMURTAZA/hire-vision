import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, Zap, Brain, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";

interface LiveInterviewerProps {
  language: string;
  profile: any;
  onTranscript?: (text: string, role: "user" | "model") => void;
  onInterruption?: () => void;
}

export default function LiveInterviewer({ language, profile, onTranscript, onInterruption }: LiveInterviewerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAIspeaking, setIsAIspeaking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isInterviewOver, setIsInterviewOver] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const elevenLabsAudioQueueRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingRef = useRef(false);
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
  const chatHistoryRef = useRef<{ role: "system" | "user" | "assistant", content: string }[]>([]);
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const playBrowserTTS = (text: string) => {
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
    utterance.onstart = () => setIsAIspeaking(true);
    utterance.onend = () => setIsAIspeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const playElevenLabsTTS = async (text: string) => {
    if (!elevenLabsKey) {
      playBrowserTTS(text);
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": elevenLabsKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        playBrowserTTS(text);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      elevenLabsAudioQueueRef.current.push(audio);
      if (!isPlayingRef.current) {
        playNextElevenLabsChunk();
      }
    } catch (err) {
      playBrowserTTS(text);
    }
  };

  const playNextElevenLabsChunk = () => {
    if (elevenLabsAudioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsAIspeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsAIspeaking(true);
    const audio = elevenLabsAudioQueueRef.current.shift()!;
    audio.onended = () => playNextElevenLabsChunk();
    audio.play();
  };

  const generateResponse = async (userInput: string) => {
    if (isInterviewOver) return;

    chatHistoryRef.current.push({ role: "user", content: userInput });
    onTranscript?.(userInput, "user");

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatHistoryRef.current
          .filter(m => m.role !== "system")
          .map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          })),
        config: {
          systemInstruction: chatHistoryRef.current.find(m => m.role === "system")?.content
        }
      });
      
      const fullResponse = response.text || "";
      chatHistoryRef.current.push({ role: "assistant", content: fullResponse });
      onTranscript?.(fullResponse, "model");
      playElevenLabsTTS(fullResponse);

      if (fullResponse.includes("?")) {
        const newCount = questionCount + 1;
        setQuestionCount(newCount);
        if (newCount >= 2) {
          setIsInterviewOver(true);
          const conclusion = language === "Urdu" 
            ? "آپ کے جوابات کا شکریہ۔ ہمارا انٹرویو اب مکمل ہو گیا ہے۔" 
            : "Thank you for your answers. Our interview is now complete.";
          setTimeout(() => {
            chatHistoryRef.current.push({ role: "assistant", content: conclusion });
            onTranscript?.(conclusion, "model");
            playElevenLabsTTS(conclusion);
          }, 5000);
        }
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      toast.error("Failed to generate response.");
    }
  };

  const startSession = async () => {
    if (isConnecting || isConnected) return;
    setIsConnecting(true);

    try {
      const systemInstruction = `You are Era, a world-class, highly empathetic human interviewer from a top-tier tech firm. 
      Your goal is to conduct a sophisticated, realistic, and humanized job interview for a candidate with this profile: ${JSON.stringify(profile)}.
      
      ADVANCED INTERVIEWER GUIDELINES:
      1. LIMIT: Ask EXACTLY 2 random, deep-dive questions in total.
      2. HUMAN PERSONALITY: Use natural speech patterns (fillers like "hmm", "that's interesting", "I see"). Show genuine curiosity.
      3. ADAPTIVE DIALOGUE: React to the candidate's specific answers. If they mention a project, ask a follow-up about it as your second question.
      4. LANGUAGE: You MUST conduct the entire interview in ${language}. Use professional yet conversational vocabulary.
      5. COMPLETION: After 2 questions have been answered, provide a brief, encouraging conclusion and stop. No 3rd question.
      6. TONE: Professional, encouraging, and slightly inquisitive.`;

      chatHistoryRef.current = [{ role: "system", content: systemInstruction }];
      
      const greetings: Record<string, string> = {
        "English": "Hello! I'm Era. Ready to start your interview?",
        "Urdu": "السلام علیکم! میں ایرا ہوں۔ کیا آپ انٹرویو شروع کرنے کے لیے تیار ہیں؟",
        "Hindi": "नमस्ते! मैं एरा हूँ। क्या आप इंटरव्यू शुरू करने के लिए तैयार हैं?",
        "Spanish": "¡Hola! Soy Era. ¿Estás listo para comenzar tu entrevista?",
        "French": "Bonjour ! Je suis Era. Êtes-vous prêt à commencer votre entretien ?",
        "German": "Hallo! Ich bin Era. Sind Sie bereit, Ihr Vorstellungsgespräch zu beginnen?",
        "Chinese": "你好！我是 Era。准备好开始面试了吗？",
        "Arabic": "مرحباً! أنا إيرا. هل أنت مستعد لبدء مقابلتك؟"
      };
      const greeting = greetings[language] || greetings["English"];
      chatHistoryRef.current.push({ role: "assistant", content: greeting });
      onTranscript?.(greeting, "model");
      playElevenLabsTTS(greeting);

      setIsConnected(true);
      setIsConnecting(false);
      toast.success("Era is online");
      startSpeechRecognition();
    } catch (err) {
      console.error("Failed to start session:", err);
      toast.error("Failed to connect to Era");
      setIsConnecting(false);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language === "Urdu" ? "ur-PK" : "en-US";

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (transcript.trim()) {
        generateResponse(transcript);
      }
    };

    recognitionRef.current.onend = () => {
      if (isConnected && !isMuted) {
        try { recognitionRef.current.start(); } catch(e) {}
      }
    };

    recognitionRef.current.start();
  };

  const toggleMute = () => {
    if (isMuted) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isConnecting ? (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-2" />
                <span className="text-xs text-blue-400 font-mono uppercase tracking-widest">Connecting...</span>
              </motion.div>
            ) : isConnected ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.1, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"
                />
                
                <div className="flex items-center justify-center gap-2 h-24">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isAIspeaking 
                          ? [15, Math.random() * 60 + 20, 15] 
                          : [10, 15, 10],
                        backgroundColor: isAIspeaking 
                          ? ["#3b82f6", "#2563eb", "#3b82f6"] 
                          : ["#475569", "#334155", "#475569"],
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                      className="w-2.5 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startSession}
                className="group relative flex flex-col items-center justify-center w-44 h-44 bg-blue-600 rounded-full shadow-xl shadow-blue-900/20 overflow-hidden border border-blue-500"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-12 h-12 text-white relative z-10 mb-2" />
                <span className="text-xs font-bold text-white relative z-10 uppercase tracking-widest">Start Interview</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Advanced AI Era</span>
        </div>
        <h3 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
          {isConnected ? "Era is Online" : "Era AI Interviewer"}
          {isConnected && (
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute" />
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
            </div>
          )}
        </h3>
        <p className="text-sm text-slate-400 max-w-xs mt-3 leading-relaxed">
          {isConnected 
            ? "Era is listening. Speak naturally and clearly."
            : "A sophisticated AI designed to conduct professional, human-like interviews."}
        </p>
      </div>

      {isConnected && (
        <div className="flex items-center gap-6">
          <button
            onClick={toggleMute}
            className={cn(
              "p-4 rounded-2xl transition-all duration-200 border flex items-center gap-3",
              isMuted 
                ? "bg-red-500/10 border-red-500/30 text-red-500" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase tracking-wider">{isMuted ? "Muted" : "Listening"}</span>
          </button>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Real-time Analysis
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              <Brain className="w-3 h-3" />
              Gemini 3 Flash
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
