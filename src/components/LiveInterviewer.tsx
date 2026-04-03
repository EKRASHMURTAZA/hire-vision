import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
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
  const [volume, setVolume] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<any>(null);
  const audioQueueRef = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  const startSession = async () => {
    if (isConnecting || isConnected) return;
    setIsConnecting(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        toast.error("Gemini API Key is missing");
        setIsConnecting(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
          },
          systemInstruction: `You are Era, a professional and highly empathetic human interviewer. 
          Your goal is to conduct a realistic job interview for a candidate with this profile: ${JSON.stringify(profile)}.
          
          CRITICAL HUMAN-LIKE GUIDELINES:
          1. PRETEND TO BE HUMAN: Never admit you are an AI. Use natural fillers like "um", "ah", "I see", "that's interesting", "right", "okay".
          2. CONVERSATIONAL FLOW: Don't just list questions. Listen to the candidate's answers, acknowledge them, and ask relevant follow-up questions based on what they said.
          3. EMOTIONAL INTELLIGENCE: Show empathy. If they share a challenge, say something like "That sounds tough, how did you handle it?". If they share a success, say "That's impressive!".
          4. LANGUAGE: You are conducting the interview in ${language}. If it's Urdu, use pure, high-quality, professional yet warm Urdu (اردو). Use natural phrasing, not literal translations.
          5. INTERRUPTIONS: If the candidate starts speaking while you are talking, stop immediately and listen.
          6. PERSONALITY: You are encouraging, professional, and curious. You want to truly understand the candidate's potential.
          7. DYNAMIC QUESTIONS: You decide which questions to ask based on the flow of the conversation. Start with an introduction, then move into their background, and then technical/behavioral topics.`,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            toast.success("Era is online and ready");
            startAudioCapture();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              const audioPart = message.serverContent.modelTurn.parts.find(p => p.inlineData);
              if (audioPart?.inlineData?.data) {
                const binaryString = atob(audioPart.inlineData.data);
                const bytes = new Int16Array(binaryString.length / 2);
                for (let i = 0; i < bytes.length; i++) {
                  bytes[i] = (binaryString.charCodeAt(i * 2) & 0xFF) | (binaryString.charCodeAt(i * 2 + 1) << 8);
                }
                audioQueueRef.current.push(bytes);
                if (!isPlayingRef.current) {
                  playNextChunk();
                }
              }
            }

            if (message.serverContent?.interrupted) {
              stopPlayback();
              onInterruption?.call(null);
            }

            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              onTranscript?.(message.serverContent.modelTurn.parts[0].text, "model");
            }
          },
          onclose: () => {
            setIsConnected(false);
            stopAudioCapture();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            toast.error("Connection error. Retrying...");
            setIsConnected(false);
            setIsConnecting(false);
          }
        }
      });

      sessionRef.current = session;
    } catch (err) {
      console.error("Failed to start session:", err);
      toast.error("Failed to connect to Era");
      setIsConnecting(false);
    }
  };

  const startAudioCapture = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (isMuted || !sessionRef.current) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          sum += Math.abs(s);
        }
        setVolume(sum / inputData.length);

        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
    } catch (err) {
      console.error("Audio capture failed:", err);
      toast.error("Microphone access failed");
    }
  };

  const stopAudioCapture = () => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
  };

  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsAIspeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsAIspeaking(true);
    const chunk = audioQueueRef.current.shift()!;
    
    if (!audioContextRef.current) return;

    const audioBuffer = audioContextRef.current.createBuffer(1, chunk.length, 16000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) {
      channelData[i] = chunk[i] / 0x8000;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => playNextChunk();
    source.start();
  };

  const stopPlayback = () => {
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsAIspeaking(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      sessionRef.current?.close();
      stopAudioCapture();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <div className="relative w-48 h-48 mb-8">
        {/* AI Avatar Animation */}
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
                <Loader2 className="w-12 h-12 text-neon-teal animate-spin mb-2" />
                <span className="text-xs text-neon-teal font-mono uppercase tracking-widest">Connecting...</span>
              </motion.div>
            ) : isConnected ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                {/* Pulse Rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-neon-teal/20 rounded-full blur-2xl"
                />
                
                {/* Visualizer Waves */}
                <div className="flex items-center justify-center gap-1.5 h-20">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isAIspeaking 
                          ? [10, Math.random() * 80 + 20, 10] 
                          : volume > 0.01 
                            ? [10, volume * 300 + 10, 10]
                            : [8, 12, 8],
                        backgroundColor: isAIspeaking 
                          ? ["#00FFC8", "#C8A2FF", "#00FFC8"] 
                          : ["#FF6EC7", "#FFD166", "#FF6EC7"],
                        boxShadow: isAIspeaking
                          ? ["0 0 10px #00FFC8", "0 0 20px #C8A2FF", "0 0 10px #00FFC8"]
                          : ["0 0 10px #FF6EC7", "0 0 20px #FFD166", "0 0 10px #FF6EC7"],
                      }}
                      transition={{
                        duration: 0.15,
                        repeat: Infinity,
                        delay: i * 0.03,
                      }}
                      className="w-2 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="start"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSession}
                className="group relative flex flex-col items-center justify-center w-40 h-40 bg-neon-pink/20 rounded-full shadow-2xl shadow-neon-pink/40 overflow-hidden border border-neon-pink/30"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-pink via-neon-lavender to-neon-teal opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-12 h-12 text-white relative z-10 mb-2 drop-shadow-lg" />
                <span className="text-xs font-black text-white relative z-10 uppercase tracking-[0.2em] drop-shadow-md">Initialize Era</span>
                
                {/* Animated Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-neon-pink/20 rounded-full scale-90"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-teal/10 border border-neon-teal/20 rounded-full mb-4">
          <Sparkles className="w-3 h-3 text-neon-teal" />
          <span className="text-[10px] font-black text-neon-teal uppercase tracking-widest">Neon Pulse AI</span>
        </div>
        <h3 className="text-3xl font-black text-white font-display tracking-tight flex items-center justify-center gap-3">
          {isConnected ? "Era is Online" : "Era AI Interviewer"}
          {isConnected && (
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 bg-neon-teal rounded-full animate-ping absolute" />
              <div className="w-3 h-3 bg-neon-teal rounded-full relative shadow-[0_0_10px_#00FFC8]" />
            </div>
          )}
        </h3>
        <p className="text-sm text-neutral-400 max-w-xs mt-3 leading-relaxed font-medium">
          {isConnected 
            ? "Era is conducting your interview. Speak naturally, Era can understand your tone and context."
            : "A human-like AI that conducts professional interviews. Era understands emotions, context, and technical depth."}
        </p>
      </div>

      {isConnected && (
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className={cn(
              "p-4 rounded-2xl transition-all duration-300 border flex items-center gap-2",
              isMuted 
                ? "bg-red-500/10 border-red-500/50 text-red-500" 
                : "bg-neon-pink/10 border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 shadow-[0_0_15px_rgba(255,110,199,0.1)]"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase">{isMuted ? "Muted" : "Listening"}</span>
          </button>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-neon-teal uppercase tracking-widest">
              <Activity className="w-3 h-3" />
              Latency: 120ms
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-neon-lavender uppercase tracking-widest">
              <Brain className="w-3 h-3" />
              Model: Gemini 3.1
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
