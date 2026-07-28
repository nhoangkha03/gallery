"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import AlbumCard from "./AlbumCard";
import type { GalleryFolder } from "@/lib/gallery";

interface AlbumGridProps {
  initialFolders: GalleryFolder[];
}

export default function AlbumGrid({ initialFolders }: AlbumGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFolders = initialFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase().replace(/-/g, " ")) ||
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
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

      {filteredFolders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed bg-background py-20 text-center">
          <p className="text-xl font-bold text-foreground">Không tìm thấy album phù hợp.</p>
          <p className="mt-2 text-muted-foreground">Từ khóa đang tìm: &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredFolders.map((folder) => (
            <AlbumCard
              key={folder.path}
              name={folder.name}
              path={folder.path}
              thumbnail={folder.thumbnail}
              count={folder.count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
