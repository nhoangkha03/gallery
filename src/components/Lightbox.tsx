"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ isOpen, onClose, items, currentIndex, onNavigate }: LightboxProps) {
  const currentItem = items[currentIndex];

  const handlePrevious = () => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % items.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/90 border-none">
        <div className="relative w-full h-full flex items-center justify-center min-h-[50vh]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <div className="w-full h-full flex items-center justify-center p-4">
            {currentItem.resource_type === "video" ? (
              <video
                src={currentItem.secure_url}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            ) : (
              <img
                src={currentItem.secure_url}
                alt={currentItem.public_id}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
            onClick={handleNext}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
