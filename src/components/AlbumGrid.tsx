"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import AlbumCard from "./AlbumCard";

interface Folder {
  name: string;
  path: string;
  thumbnail: string | null;
  count: number;
}

interface AlbumGridProps {
  initialFolders: Folder[];
}

export default function AlbumGrid({ initialFolders }: AlbumGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFolders = initialFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase().replace(/-/g, " ")) ||
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative max-w-md mx-auto group">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-colors" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search collections..."
            className="pl-12 pr-12 h-14 rounded-2xl bg-background/50 backdrop-blur-sm border-2 focus-visible:ring-0 focus-visible:border-primary transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {filteredFolders.length === 0 ? (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed">
          <p className="text-xl font-medium text-muted-foreground">No collections found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
