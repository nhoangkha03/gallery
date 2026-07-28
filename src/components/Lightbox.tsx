"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAssetName, getPreviewUrl } from "@/lib/gallery";
import type { MediaItem } from "@/lib/gallery";

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
  const currentName = getAssetName(currentItem?.public_id || "");
  const previewUrl = getPreviewUrl(currentItem);

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
    link.download = currentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!confirm("Bạn chắc chắn muốn xóa tệp này?")) return;

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        body: JSON.stringify({ 
          publicId: currentItem.public_id,
          resourceType: currentItem.resource_type 
        }),
      });

      if (res.ok) {
        toast.success("Đã xóa tệp");
        
        // If it was the last item, close the lightbox
        if (items.length === 1) {
          onClose();
        } else {
          // Navigate to next item before the list updates
          handleNext();
        }
        
        router.refresh();
      } else {
        throw new Error("Không thể xóa tệp");
      }
    } catch {
      toast.error("Không thể xóa tệp. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-screen w-screen max-w-none overflow-hidden rounded-none border-none bg-black/95 p-0 shadow-none outline-none ring-0 focus:ring-0 sm:max-w-none">
        <DialogTitle className="sr-only">Trình xem - {currentItem.public_id}</DialogTitle>
        
        <div className="relative flex h-full w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${currentItem.public_id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute inset-0 z-0"
            >
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  className="scale-110 object-cover blur-[100px] saturate-150"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 top-0 z-50 flex min-h-20 items-center justify-between gap-4 bg-gradient-to-b from-black/70 to-transparent px-4 py-4 md:px-6">
             <div className="flex min-w-0 items-center gap-3">
                <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <span className="text-sm font-bold text-white">{currentIndex + 1}</span>
                  <span className="text-[10px] font-black uppercase text-white/40">/ {items.length}</span>
                </div>
                <p className="hidden max-w-[260px] truncate text-sm font-medium text-white/80 md:block">
                  {currentName}
                </p>
             </div>

             <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl text-white transition-colors hover:bg-white/10"
                  onClick={handleDownload}
                  title="Tải xuống"
                >
                  <Download className="h-5 w-5" />
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-2xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-destructive/20 hover:text-destructive"
                    onClick={handleDelete}
                    title="Xóa"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border border-white/10 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95"
                  onClick={onClose}
                  title="Đóng"
                >
                  <X className="h-6 w-6" />
                </Button>
             </div>
          </div>

          <div className="relative z-10 mt-0 flex h-full w-full items-center justify-center overflow-hidden p-2 md:p-4">
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
                    poster={previewUrl || undefined}
                    className="max-h-full max-w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={currentItem.secure_url}
                      alt={currentItem.public_id}
                      fill
                      sizes="100vw"
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-50 flex -translate-y-1/2 justify-between px-2 md:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="group pointer-events-auto h-14 w-14 rounded-3xl text-white transition-all hover:bg-white/10 active:scale-90 md:h-20 md:w-20"
              onClick={handlePrevious}
              title="Tệp trước"
            >
              <ChevronLeft className="h-10 w-10 transition-transform group-hover:-translate-x-1 md:h-14 md:w-14" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="group pointer-events-auto h-14 w-14 rounded-3xl text-white transition-all hover:bg-white/10 active:scale-90 md:h-20 md:w-20"
              onClick={handleNext}
              title="Tệp tiếp theo"
            >
              <ChevronRight className="h-10 w-10 transition-transform group-hover:translate-x-1 md:h-14 md:w-14" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-3 md:flex">
             <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 backdrop-blur-md">
                <span className="rounded border border-white/10 bg-white/10 p-1">ESC</span> Đóng
                <span className="mx-1 h-1 w-1 rounded-full bg-white/20" />
                <span className="rounded border border-white/10 bg-white/10 p-1">←</span> Trước
                <span className="mx-1 h-1 w-1 rounded-full bg-white/20" />
                <span className="rounded border border-white/10 bg-white/10 p-1">→</span> Sau
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
