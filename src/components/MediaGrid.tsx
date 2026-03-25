"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Lightbox from "./Lightbox";

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

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
