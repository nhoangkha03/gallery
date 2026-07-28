"use client";

import Image from "next/image";
import { Play, Trash2 } from "lucide-react";
import Lightbox from "./Lightbox";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPreviewUrl } from "@/lib/gallery";
import type { MediaItem } from "@/lib/gallery";

interface MediaGridProps {
  items: MediaItem[];
}

export default function MediaGrid({ items }: MediaGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("is_admin") === "true");
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    if (!confirm("Bạn chắc chắn muốn xóa tệp này?")) return;

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        body: JSON.stringify({ 
          publicId: item.public_id,
          resourceType: item.resource_type 
        }),
      });

      if (res.ok) {
        toast.success("Đã xóa tệp");
        router.refresh();
      } else {
        throw new Error("Không thể xóa tệp");
      }
    } catch {
      toast.error("Không thể xóa tệp. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 min-[1920px]:grid-cols-10 min-[2560px]:grid-cols-12">
        {items.map((item, index) => (
          <div
            key={item.public_id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted ring-1 ring-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLightbox(index);
            }}
          >
            {item.resource_type === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-black/10">
                <video
                  src={item.secure_url}
                  poster={getPreviewUrl(item) || undefined}
                  className="h-full w-full object-cover"
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/45">
                  <div className="rounded-full bg-white/95 p-3 shadow-lg">
                    <Play className="h-6 w-6 fill-black text-black" />
                  </div>
                </div>
              </div>
            ) : (
              <Image
                src={item.secure_url}
                alt={item.public_id}
                fill
                sizes="(min-width: 2560px) 8vw, (min-width: 1920px) 10vw, (min-width: 1536px) 12.5vw, (min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {isAdmin && (
              <button
                onClick={(e) => handleDelete(e, item)}
                className="absolute right-2 top-2 z-10 rounded-xl bg-destructive/90 p-2 text-white opacity-0 shadow-lg transition-all hover:bg-destructive group-hover:opacity-100"
                aria-label="Xóa tệp"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
          </div>
        ))}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={items}
        currentIndex={currentIndex}
        onNavigate={setCurrentIndex}
      />
    </>
  );
}
