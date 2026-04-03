import { motion } from "motion/react";

interface AIFaceProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export default function AIFace({ isSpeaking, isListening }: AIFaceProps) {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Glow Effect */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.1, 1] : 1,
          opacity: isSpeaking ? [0.2, 0.4, 0.2] : 0.1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-blue-500 rounded-full blur-3xl"
      />

      {/* Face Container */}
      <motion.div
        animate={{
          y: isSpeaking ? [0, -5, 0] : 0,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-32 h-32 bg-slate-900 border-2 border-blue-500/30 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-blue-500/20"
      >
        {/* Eyes */}
        <div className="flex gap-8 mb-4">
          <motion.div
            animate={{
              scaleY: isSpeaking ? [1, 0.1, 1] : 1,
            }}
            transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0, repeatDelay: 3 }}
            className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"
          />
          <motion.div
            animate={{
              scaleY: isSpeaking ? [1, 0.1, 1] : 1,
            }}
            transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0, repeatDelay: 3 }}
            className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"
          />
        </div>

        {/* Mouth - Smiling */}
        <motion.div
          animate={{
            width: isSpeaking ? [40, 60, 40] : 50,
            height: isSpeaking ? [8, 16, 8] : 10,
            borderRadius: isSpeaking ? "40% 40% 60% 60%" : "20% 20% 80% 80%",
          }}
          transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0 }}
          className="bg-blue-400 rounded-full shadow-[0_0_20px_#60a5fa] border-b-2 border-blue-300/50"
        />

        {/* Smiling Cheeks (More visible) */}
        <div className="absolute top-[55%] left-0 w-full flex justify-between px-4">
          <motion.div 
            animate={{ 
              opacity: isSpeaking ? [0.2, 0.5, 0.2] : 0.3,
              scale: isSpeaking ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-3 bg-blue-500/40 rounded-full blur-md" 
          />
          <motion.div 
            animate={{ 
              opacity: isSpeaking ? [0.2, 0.5, 0.2] : 0.3,
              scale: isSpeaking ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="w-6 h-3 bg-blue-500/40 rounded-full blur-md" 
          />
        </div>
      </motion.div>

      {/* Listening Indicator */}
      {isListening && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-4 px-4 py-1 bg-red-500/10 border border-red-500/20 rounded-full"
        >
          <p className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Listening</p>
        </motion.div>
      )}
    </div>
  );
}
