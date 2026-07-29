"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Folder, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatAlbumName, pluralizeAsset } from "@/lib/gallery";

interface AlbumCardProps {
  name: string;
  path: string;
  thumbnail: string | null;
  count: number;
  layoutMode?: "luoi" | "danhsach";
}

export default function AlbumCard({ name, path, thumbnail, count, layoutMode = "luoi" }: AlbumCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const displayName = formatAlbumName(name);
  const albumHref = `/album/${encodeURIComponent(path || name)}`;

  useEffect(() => {
    setIsAdmin(localStorage.getItem("is_admin") === "true");
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Bạn chắc chắn muốn xóa album "${displayName}" cùng toàn bộ nội dung bên trong?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/folders/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Đã xóa album "${displayName}"`);
        router.refresh();
      } else {
        throw new Error("Không thể xóa album");
      }
    } catch {
      toast.error("Không thể xóa album. Vui lòng thử lại.");
    }
  };

  return (
    <Link href={albumHref} className="block h-full">
      <Card className={`group relative h-full overflow-hidden rounded-2xl border bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${layoutMode === "danhsach" ? "md:grid md:grid-cols-[240px_1fr]" : ""}`}>
        <CardContent className={`relative flex items-center justify-center overflow-hidden p-0 ${layoutMode === "danhsach" ? "aspect-[16/10] md:aspect-auto md:min-h-40" : "aspect-[4/3]"}`}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={`Ảnh đại diện album ${displayName}`}
              fill
              sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover brightness-95 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent/20">
              <Folder className="h-16 w-16 text-primary/45 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          
          <div className="absolute inset-x-4 bottom-4">
            <h3 className="truncate text-xl font-black capitalize tracking-tight text-white drop-shadow-md">
              {displayName}
            </h3>
            <p className="mt-1 text-sm font-semibold text-white/80">
              {pluralizeAsset(count)}
            </p>
          </div>
          
          <div className="absolute right-4 top-4 flex translate-y-2 gap-2 rounded-xl border border-white/20 bg-white/15 p-2 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
             {isAdmin && (
               <button 
                 onClick={handleDelete}
                 className="rounded-lg bg-destructive p-2 text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                 title="Xóa bộ sưu tập"
               >
                 <Trash2 className="h-4 w-4" />
               </button>
             )}
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
               <ArrowUpRight className="h-4 w-4" />
             </div>
          </div>
        </CardContent>
        {layoutMode === "danhsach" && (
          <div className="hidden min-w-0 flex-col justify-between p-5 md:flex">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Album</p>
              <h3 className="mt-2 truncate text-2xl font-black capitalize tracking-tight">{displayName}</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{pluralizeAsset(count)} trong bộ sưu tập này</p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">
              Mở album
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
