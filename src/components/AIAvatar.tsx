import { motion, AnimatePresence } from "motion/react";
import { Brain, Sparkles, Shield, Award } from "lucide-react";
import { cn } from "../lib/utils";

interface AIAvatarProps {
  isSpeaking: boolean;
  score: number;
  mode?: "friendly" | "boss";
}

export default function AIAvatar({ isSpeaking, score, mode = "boss" }: AIAvatarProps) {
  const getStatusColor = () => {
    if (score > 80) return "text-neon-teal shadow-neon-teal/20 border-neon-teal/50";
    if (score > 50) return "text-neon-lavender shadow-neon-lavender/20 border-neon-lavender/50";
    return "text-neon-pink shadow-neon-pink/20 border-neon-pink/50";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0D0F1A]/50 rounded-[3rem] border border-white/5 overflow-hidden group">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.1, 1] : 1,
            opacity: isSpeaking ? [0.1, 0.15, 0.1] : 0.05,
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn(
            "w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-1000",
            score > 80 ? "bg-neon-teal/20" : score > 50 ? "bg-neon-lavender/20" : "bg-neon-pink/20"
          )}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* The "Face" */}
        <div className="relative">
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: isSpeaking ? [0, 1, -1, 0] : 0,
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "w-56 h-56 rounded-[4rem] bg-neutral-800 border-2 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500",
              getStatusColor()
            )}
          >
            {/* Boss Mode Details */}
            {mode === "boss" && (
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent" />
                <Shield className="absolute bottom-4 right-4 w-12 h-12" />
              </div>
            )}

            {/* Eyes */}
            <div className="absolute top-20 left-0 w-full flex justify-around px-12">
              <motion.div 
                animate={{ 
                  scaleY: [1, 0.1, 1],
                  scaleX: isSpeaking ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
                className={cn(
                  "w-5 h-5 rounded-full shadow-[0_0_15px_currentColor] transition-colors duration-500",
                  score > 80 ? "bg-neon-teal" : score > 50 ? "bg-neon-lavender" : "bg-neon-pink"
                )} 
              />
              <motion.div 
                animate={{ 
                  scaleY: [1, 0.1, 1],
                  scaleX: isSpeaking ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
                className={cn(
                  "w-5 h-5 rounded-full shadow-[0_0_15px_currentColor] transition-colors duration-500",
                  score > 80 ? "bg-neon-teal" : score > 50 ? "bg-neon-lavender" : "bg-neon-pink"
                )} 
              />
            </div>

            {/* Mouth/Voice Wave */}
            <div className="absolute bottom-14 w-full flex justify-center items-center gap-1.5 h-10">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isSpeaking ? [10, 32, 10] : 6,
                    opacity: isSpeaking ? [0.5, 1, 0.5] : 0.3,
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                  className={cn(
                    "w-2 rounded-full transition-colors duration-500",
                    score > 80 ? "bg-neon-teal" : score > 50 ? "bg-neon-lavender" : "bg-neon-pink"
                  )}
                />
              ))}
            </div>

            <Brain className="w-16 h-16 text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>

          {/* Floating Indicators */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 20 }}
                className="absolute -top-6 -right-6 p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20"
              >
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </motion.div>
            )}
            {score > 80 && (
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -20 }}
                className="absolute -bottom-6 -left-6 p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-600/20"
              >
                <Award className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500 mb-3">
            {mode === "boss" ? "Executive Interviewer" : "AI Neural Core"}
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-500",
              isSpeaking ? "bg-blue-500 animate-pulse scale-125" : "bg-neutral-600"
            )} />
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              {isSpeaking ? "Analyzing Response..." : "Awaiting Candidate"}
            </span>
          </div>
        </div>
      </div>

      {/* Futuristic HUD Elements */}
      <div className="absolute inset-0 border-[20px] border-transparent border-t-white/[0.02] border-b-white/[0.02] pointer-events-none" />
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-2xl" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-2xl" />
    </div>
  );
}
