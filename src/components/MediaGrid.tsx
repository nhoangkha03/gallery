"use client";

import Image from "next/image";
import { Film, Grid2X2, Image as ImageIcon, Play, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import Lightbox from "./Lightbox";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAssetName, getPreviewUrl } from "@/lib/gallery";
import type { MediaItem } from "@/lib/gallery";

interface MediaGridProps {
  items: MediaItem[];
}

export default function MediaGrid({ items }: MediaGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"tat-ca" | "anh" | "video">("tat-ca");
  const [density, setDensity] = useState<"thoang" | "vua" | "day">("vua");
  const router = useRouter();
  const imageCount = items.filter((item) => item.resource_type === "image").length;
  const videoCount = items.filter((item) => item.resource_type === "video").length;
  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredItems = items.filter((item) => {
    const matchesType =
      filterType === "tat-ca" ||
      (filterType === "anh" && item.resource_type === "image") ||
      (filterType === "video" && item.resource_type === "video");
    const matchesQuery = getAssetName(item.public_id).toLowerCase().includes(normalizedQuery);

    return matchesType && matchesQuery;
  });

  const gridClassName = {
    thoang: "grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    vua: "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 min-[1920px]:grid-cols-10 min-[2560px]:grid-cols-12",
    day: "grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 min-[1920px]:grid-cols-[repeat(14,minmax(0,1fr))] min-[2560px]:grid-cols-[repeat(16,minmax(0,1fr))]",
  }[density];

  useEffect(() => {
    setIsAdmin(localStorage.getItem("is_admin") === "true");
  }, []);

  useEffect(() => {
    if (currentIndex >= filteredItems.length) {
      setCurrentIndex(Math.max(filteredItems.length - 1, 0));
    }
  }, [currentIndex, filteredItems.length]);

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
      <div className="mb-6 rounded-2xl border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Bộ lọc media</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Đang hiển thị {filteredItems.length}/{items.length} tệp trong album.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm theo tên tệp..."
                className="h-10 w-full rounded-xl border bg-background pl-10 pr-10 text-sm font-medium outline-none transition-colors focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterButton
                active={filterType === "tat-ca"}
                onClick={() => setFilterType("tat-ca")}
                label={`Tất cả (${items.length})`}
                icon={<SlidersHorizontal className="h-4 w-4" />}
              />
              <FilterButton
                active={filterType === "anh"}
                onClick={() => setFilterType("anh")}
                label={`Ảnh (${imageCount})`}
                icon={<ImageIcon className="h-4 w-4" />}
              />
              <FilterButton
                active={filterType === "video"}
                onClick={() => setFilterType("video")}
                label={`Video (${videoCount})`}
                icon={<Film className="h-4 w-4" />}
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-1">
              {(["thoang", "vua", "day"] as const).map((mode) => {
                const label = mode === "thoang" ? "Thoáng" : mode === "vua" ? "Vừa" : "Dày";

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDensity(mode)}
                    className={`flex h-8 min-w-10 items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${density === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    title={`Mật độ ${label.toLowerCase()}`}
                  >
                    <Grid2X2 className="mr-1 h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed bg-background py-20 text-center">
          <p className="text-xl font-bold text-foreground">Không có tệp phù hợp.</p>
          <p className="mt-2 text-muted-foreground">Thử đổi bộ lọc hoặc xóa từ khóa tìm kiếm.</p>
        </div>
      ) : (
      <div className={`grid ${gridClassName}`}>
        {filteredItems.map((item, index) => (
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 to-transparent p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <p className="truncate text-xs font-bold text-white">{getAssetName(item.public_id)}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-white/70">
                {item.resource_type === "video" ? "Video" : "Ảnh"}
              </p>
            </div>
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
      )}

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredItems}
        currentIndex={currentIndex}
        onNavigate={setCurrentIndex}
      />
    </>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
    >
      {icon}
      {label}
    </button>
  );
}
