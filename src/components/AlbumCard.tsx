import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Folder } from "lucide-react";

interface AlbumCardProps {
  name: string;
  path: string;
  thumbnail: string | null;
  count: number;
}

export default function AlbumCard({ name, path, thumbnail, count }: AlbumCardProps) {
  return (
    <Link href={`/album/${name}`}>
      <Card className="overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer group rounded-2xl bg-muted/20">
        <CardContent className="p-0 relative aspect-[4/3] flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Folder className="w-16 h-16 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-bold text-xl text-white capitalize truncate drop-shadow-md">
              {name.replace(/-/g, " ")}
            </h3>
            <p className="text-white/80 text-sm font-medium">
              {count} {count === 1 ? 'Item' : 'Items'}
            </p>
          </div>
          
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
               <Folder className="w-3 h-3 text-black fill-black" />
             </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
