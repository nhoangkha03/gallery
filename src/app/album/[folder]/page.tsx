import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Film, Image as ImageIcon, Images } from "lucide-react";
import MediaGrid from "@/components/MediaGrid";
import cloudinary from "@/lib/cloudinary";
import { formatAlbumName, getPreviewUrl } from "@/lib/gallery";
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
    console.error(`Không thể tải media trong album ${folder}:`, error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ folder: string }> }): Promise<Metadata> {
  const { folder } = await params;
  const albumName = formatAlbumName(decodeURIComponent(folder));

  return {
    title: albumName,
    description: `Xem ảnh và video trong album ${albumName}.`,
    openGraph: {
      title: `${albumName} | Ký ức số`,
      description: `Album ảnh và video ${albumName}.`,
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ folder: string }> }) {
  const { folder } = await params;
  const decodedFolder = decodeURIComponent(folder);
  const media = await getMedia(decodedFolder);
  const albumName = formatAlbumName(decodedFolder);
  const imageCount = media.filter((item) => item.resource_type === "image").length;
  const videoCount = media.filter((item) => item.resource_type === "video").length;
  const featuredPreview = getPreviewUrl(media[0]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="relative mb-8 overflow-hidden border-b bg-background py-10 lg:py-12">
        {featuredPreview && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={featuredPreview}
              alt=""
              fill
              sizes="100vw"
              className="object-cover blur-2xl saturate-150"
              priority
            />
          </div>
        )}
        <div className="relative mx-auto w-full max-w-[1800px] px-4 lg:px-8">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Quay lại trang chủ
          </Link>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-600">Album</p>
              <h1 className="text-4xl font-black capitalize tracking-tight md:text-6xl">
                {albumName || "Album"}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Duyệt nội dung theo loại tệp, tìm nhanh theo tên và mở trình xem toàn màn hình.
              </p>
            </div>
            <div className="grid w-full gap-3 rounded-2xl border bg-background/85 p-3 shadow-sm backdrop-blur md:w-[420px] md:grid-cols-3">
              <div className="rounded-xl bg-muted/40 p-4">
                <Images className="mb-3 h-5 w-5 text-amber-600" />
                <p className="text-2xl font-black">{media.length}</p>
                <p className="text-sm font-semibold text-muted-foreground">Tất cả</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <ImageIcon className="mb-3 h-5 w-5 text-amber-600" />
                <p className="text-2xl font-black">{imageCount}</p>
                <p className="text-sm font-semibold text-muted-foreground">Ảnh</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <Film className="mb-3 h-5 w-5 text-amber-600" />
                <p className="text-2xl font-black">{videoCount}</p>
                <p className="text-sm font-semibold text-muted-foreground">Video</p>
              </div>
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
