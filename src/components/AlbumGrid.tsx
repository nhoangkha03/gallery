"use client";

import { useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import AlbumCard from "./AlbumCard";
import type { GalleryFolder } from "@/lib/gallery";

interface AlbumGridProps {
  initialFolders: GalleryFolder[];
}

export default function AlbumGrid({ initialFolders }: AlbumGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<"mac-dinh" | "ten" | "nhieu-tep">("mac-dinh");
  const [layoutMode, setLayoutMode] = useState<"luoi" | "danhsach">("luoi");

  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredFolders = initialFolders
    .filter((folder) =>
      folder.name.toLowerCase().includes(normalizedQuery.replace(/-/g, " ")) ||
      folder.name.toLowerCase().includes(normalizedQuery)
    )
    .sort((a, b) => {
      if (sortMode === "ten") return a.name.localeCompare(b.name, "vi");
      if (sortMode === "nhieu-tep") return b.count - a.count;
      return initialFolders.indexOf(a) - initialFolders.indexOf(b);
    });

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-background p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">Tìm nhanh album</p>
          <p className="mt-1 text-sm text-muted-foreground">Lọc theo tên album, kể cả tên có dấu hoặc dấu gạch ngang.</p>
        </div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nhập tên album..."
              className="h-12 rounded-xl border-2 bg-background pl-12 pr-12 text-base transition-all focus-visible:border-primary focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-muted"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            {filteredFolders.length} album phù hợp
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 rounded-xl border bg-background px-3 text-sm font-semibold outline-none transition-colors focus:border-primary"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
              aria-label="Sắp xếp album"
            >
              <option value="mac-dinh">Thứ tự ưu tiên</option>
              <option value="ten">Tên A-Z</option>
              <option value="nhieu-tep">Nhiều tệp nhất</option>
            </select>

            <div className="flex rounded-xl border bg-muted/30 p-1" aria-label="Chọn kiểu hiển thị">
              <button
                type="button"
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition-colors ${layoutMode === "luoi" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setLayoutMode("luoi")}
                title="Hiển thị dạng lưới"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition-colors ${layoutMode === "danhsach" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setLayoutMode("danhsach")}
                title="Hiển thị dạng danh sách"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredFolders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed bg-background py-20 text-center">
          <p className="text-xl font-bold text-foreground">Không tìm thấy album phù hợp.</p>
          <p className="mt-2 text-muted-foreground">Từ khóa đang tìm: &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className={layoutMode === "luoi" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" : "grid grid-cols-1 gap-4"}>
          {filteredFolders.map((folder) => (
            <AlbumCard
              key={folder.path}
              name={folder.name}
              path={folder.path}
              thumbnail={folder.thumbnail}
              count={folder.count}
              layoutMode={layoutMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
