"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [direction, setDirection] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const currentItem = items[currentIndex];

  useEffect(() => {
    setIsAdmin(localStorage.getItem("is_admin") === "true");
  }, []);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    setDirection(1);
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

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
  }, [isOpen, handlePrevious, handleNext, onClose]);

  if (!currentItem) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const handleDownload = () => {
    // Injects fl_attachment after /upload/ to force download
    const downloadUrl = currentItem.secure_url.replace('/upload/', '/upload/fl_attachment/');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = currentItem.public_id.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        body: JSON.stringify({ 
          publicId: currentItem.public_id,
          resourceType: currentItem.resource_type 
        }),
      });

      if (res.ok) {
        toast.success("Item deleted successfully");
        
        // If it was the last item, close the lightbox
        if (items.length === 1) {
          onClose();
        } else {
          // Navigate to next item before the list updates
          handleNext();
        }
        
        router.refresh();
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 overflow-hidden bg-black border-none ring-0 focus:ring-0 outline-none">
        <DialogTitle className="sr-only">Viewer - {currentItem.public_id}</DialogTitle>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Dynamic Blurred Background */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${currentItem.public_id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <img
                src={currentItem.secure_url}
                alt=""
                className="w-full h-full object-cover blur-[100px] saturate-150 scale-110"
              />
            </motion.div>
          </AnimatePresence>

          {/* Top Bar Controls */}
          <div className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/60 to-transparent">
             <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{currentIndex + 1}</span>
                  <span className="text-white/40 text-[10px] font-black uppercase">/ {items.length}</span>
                </div>
                <p className="text-white/80 font-medium text-sm hidden md:block max-w-[200px] truncate">
                  {currentItem.public_id.split('/').pop()}
                </p>
             </div>

             <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-2xl text-white hover:bg-white/10 transition-colors"
                  onClick={handleDownload}
                  title="Tải xuống"
                >
                  <Download className="w-5 h-5" />
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-2xl text-white hover:bg-destructive/20 hover:text-destructive transition-colors bg-white/10 border border-white/10"
                    onClick={handleDelete}
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-2xl text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all bg-white/10 border border-white/10"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </Button>
             </div>
          </div>

          {/* Main Media Content */}
          <div className="relative w-full h-full mt-4 flex items-center justify-center p-4 md:p-12 z-10 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentItem.public_id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.3 }
                }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                {currentItem.resource_type === "video" ? (
                  <video
                    src={currentItem.secure_url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-2xl shadow-2xl-strong ring-1 ring-white/10"
                  />
                ) : (
                  <img
                    src={currentItem.secure_url}
                    alt={currentItem.public_id}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 md:px-8 flex justify-between pointer-events-none z-50">
            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 md:w-20 md:h-20 rounded-3xl text-white hover:bg-white/10 pointer-events-auto transition-all active:scale-90 group"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-10 h-10 md:w-14 md:h-14 group-hover:-translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 md:w-20 md:h-20 rounded-3xl text-white hover:bg-white/10 pointer-events-auto transition-all active:scale-90 group"
              onClick={handleNext}
            >
              <ChevronRight className="w-10 h-10 md:w-14 md:h-14 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Bottom Bar / Shortcuts */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
             <div className="px-5 py-2 rounded-full glass-morphism text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase hidden md:flex items-center gap-2 border border-white/5">
                <span className="p-1 rounded bg-white/10 border border-white/10">ESC</span> Close
                <span className="w-1 h-1 rounded-full bg-white/20 mx-1" />
                <span className="p-1 rounded bg-white/10 border border-white/10">←</span> Prev
                <span className="w-1 h-1 rounded-full bg-white/20 mx-1" />
                <span className="p-1 rounded bg-white/10 border border-white/10">→</span> Next
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
