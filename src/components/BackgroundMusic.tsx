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

    // Set volume to 80%
    audio.volume = 0.8;

    // Browser requires interaction. We'll listen for the first click on the document.
    const handleInteraction = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
      } catch (error) {
        console.error("Playback failed even after interaction:", error);
      }
    };

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay blocked. Waiting for user interaction.");
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
        // Ensure it's playing if it was paused for some reason
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
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl text-foreground group overflow-hidden"
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {/* Subtle pulse animation when playing */}
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
              className="absolute inset-0 bg-primary/20 rounded-full"
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
                <VolumeX className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="playing"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <Volume2 className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover tooltips or labels can be added here if needed */}
        </motion.button>
      </div>
    </>
  );
}
