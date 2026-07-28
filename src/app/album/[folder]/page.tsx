import Link from "next/link";
import { ChevronLeft, Images } from "lucide-react";
import MediaGrid from "@/components/MediaGrid";
import cloudinary from "@/lib/cloudinary";
import { formatAlbumName } from "@/lib/gallery";
import type { CloudinarySearchResponse, MediaItem } from "@/lib/gallery";

async function getMedia(folder: string): Promise<MediaItem[]> {
  try {
    let allResources: MediaItem[] = [];
    let nextCursor: string | undefined;

    do {
      const searchParams = cloudinary.search
        .expression(`folder:"${folder}"`)
        .sort_by("public_id", "desc")
        .max_results(500);

      if (nextCursor) {
        searchParams.next_cursor(nextCursor);
      }

      const response = await searchParams.execute() as CloudinarySearchResponse;
      allResources = allResources.concat(response.resources);
      nextCursor = response.next_cursor;
    } while (nextCursor);

    return allResources;
  } catch (error) {
    console.error(`Error fetching media for folder ${folder}:`, error);
    return [];
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ folder: string }> }) {
  const { folder } = await params;
  const decodedFolder = decodeURIComponent(folder);
  const media = await getMedia(decodedFolder);
  const albumName = formatAlbumName(decodedFolder);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--background),oklch(0.985_0.01_95))]">
      <section className="relative mb-8 border-b bg-background py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1800px] px-4 lg:px-8">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Quay lại trang chủ
          </Link>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-600">Album</p>
              <h1 className="text-4xl font-black capitalize tracking-tight md:text-6xl">
                {albumName || "Album"}
              </h1>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-2xl border bg-muted/25 px-5 py-3">
              <Images className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-black">{media.length}</span>
              <span className="font-medium text-muted-foreground">tệp media</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1800px] px-4 pb-20 lg:px-8">
        {media.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed bg-background py-28 text-center">
            <p className="text-2xl font-bold text-foreground">Album này chưa có nội dung.</p>
            <p className="mt-3 text-muted-foreground">Vào trang quản trị để thêm ảnh hoặc video.</p>
          </div>
        ) : (
          <MediaGrid items={media} />
        )}
      </div>
    </main>
  );
}
