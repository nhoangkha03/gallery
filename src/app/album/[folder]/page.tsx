import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import MediaGrid from "@/components/MediaGrid";
import cloudinary from "@/lib/cloudinary";

async function getMedia(folder: string) {
  try {
    const { resources } = await cloudinary.search
      .expression(`folder:"${folder}"`)
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();
    return resources;
  } catch (error) {
    console.error(`Error fetching media for folder ${folder}:`, error);
    return [];
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ folder: string }> }) {
  const { folder } = await params;
  const decodedFolder = decodeURIComponent(folder);
  const media = await getMedia(decodedFolder);

  return (
    <main className="min-h-screen">
      {/* Album Header Hero */}
      <section className="bg-muted/30 border-b relative py-16 mb-12">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Collection</p>
              <h1 className="text-4xl md:text-6xl font-black capitalize tracking-tight">
                {decodedFolder?.replace(/-/g, " ") || "Album"}
              </h1>
            </div>
            <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md px-6 py-3 rounded-2xl border w-fit">
              <span className="text-2xl font-bold">{media.length}</span>
              <span className="text-muted-foreground font-medium">Assets</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {media.length === 0 ? (
          <div className="text-center py-32 bg-muted/10 rounded-3xl border-2 border-dashed">
            <p className="text-2xl font-semibold text-muted-foreground">This collection is currently empty.</p>
            <p className="text-muted-foreground mt-3">Visit the admin panel to add images or videos.</p>
          </div>
        ) : (
          <MediaGrid items={media} />
        )}
      </div>
    </main>
  );
}
