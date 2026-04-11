"use client";

import { Play, Trash2 } from "lucide-react";
import Lightbox from "./Lightbox";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
}

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
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        body: JSON.stringify({ 
          publicId: item.public_id,
          resourceType: item.resource_type 
        }),
      });

      if (res.ok) {
        toast.success("Item deleted successfully");
        router.refresh();
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 min-[1920px]:grid-cols-10 min-[2560px]:grid-cols-12 gap-4">
        {items.map((item, index) => (
          <div
            key={item.public_id}
            className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            {item.resource_type === "video" ? (
              <div className="w-full h-full flex items-center justify-center bg-black/10">
                <video
                  src={item.secure_url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg">
                    <Play className="w-6 h-6 text-black fill-black" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.secure_url}
                alt={item.public_id}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            {isAdmin && (
              <button
                onClick={(e) => handleDelete(e, item)}
                className="absolute top-2 right-2 p-2 bg-destructive/80 hover:bg-destructive text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg pointer-events-none" />
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
