"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;

    const handleInteraction = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
      } catch (error) {
        console.error("Không thể phát nhạc sau tương tác:", error);
      }
    };

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        console.log("Trình duyệt chặn tự động phát nhạc. Đang chờ người dùng tương tác.");
        document.addEventListener("click", handleInteraction);
        document.addEventListener("touchstart", handleInteraction);
      }
    };

    playAudio();

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.m4a"
        loop
        preload="auto"
        className="hidden"
      />
      
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-background/85 text-foreground shadow-xl backdrop-blur-xl"
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {!isMuted && isPlaying && (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full bg-amber-500/20"
            />
          )}

          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.div
                key="muted"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <VolumeX className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="playing"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <Volume2 className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
