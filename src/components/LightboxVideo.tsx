"use client";

import { useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface LightboxVideoProps {
  src: string;
  poster?: string | null;
  title: string;
}

export default function LightboxVideo({ src, poster, title }: LightboxVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (value: string) => {
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Number(value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleFullscreen = async () => {
    await frameRef.current?.requestFullscreen();
  };

  return (
    <div
      ref={frameRef}
      className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
    >
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          autoPlay
          playsInline
          preload="metadata"
          className="max-h-[calc(100vh-260px)] w-full bg-black object-contain"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        />
      </div>

      <div className="border-t border-white/10 bg-black/95 p-3 text-white">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-semibold text-white/80">{title}</p>
          <p className="shrink-0 text-xs font-bold tabular-nums text-white/60">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(event) => handleSeek(event.target.value)}
          className="h-2 w-full cursor-pointer accent-amber-400"
          aria-label="Tua video"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition-transform active:scale-95"
              title={isPlaying ? "Tạm dừng" : "Phát video"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-black" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleFullscreen}
            className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
            title="Toàn màn hình"
          >
            <Maximize2 className="h-4 w-4" />
            Toàn màn hình
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}
