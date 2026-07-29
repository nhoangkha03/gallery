import Image from "next/image";
import AlbumGrid from "@/components/AlbumGrid";
import cloudinary from "@/lib/cloudinary";
import { sortFolders } from "@/lib/config";
import { formatAlbumName } from "@/lib/gallery";
import type { CloudinaryFolder, CloudinarySearchResponse, GalleryFolder } from "@/lib/gallery";

// Revalidate data every 60 seconds instead of force-dynamic to save Cloudinary API credits
export const revalidate = 60;

async function getFolders(): Promise<GalleryFolder[]> {
  try {
    const { folders } = await cloudinary.api.root_folders() as { folders?: CloudinaryFolder[] };
    
    if (!folders || folders.length === 0) return [];

    const sortedFolders = sortFolders(folders);

    // 2. Fetch thumbnails only if needed, and with a slight delay or batching
    // For large galleries, this is where the rate limit usually hits.
    const foldersWithThumbnails = await Promise.all(
      sortedFolders.map(async (folder) => {
        try {
          const { resources, total_count } = await cloudinary.search
            .expression(`folder:"${folder.name}"`)
            .sort_by("public_id", "desc")
            .max_results(30)
            .execute() as CloudinarySearchResponse;
          
          const firstItem = resources.find((r) => r.resource_type === "image") || resources[0];
          let thumbUrl = firstItem?.secure_url || null;

          if (thumbUrl && firstItem?.resource_type === "video") {
            thumbUrl = thumbUrl.replace(/\.[^/.]+$/, ".jpg");
          }

          return {
            name: folder.name,
            path: folder.path,
            thumbnail: thumbUrl,
            count: total_count || resources.length,
          };
        } catch (innerError) {
          const message = innerError instanceof Error ? innerError.message : "Không rõ lỗi";
          console.warn(`Không thể tải chi tiết album ${folder.name}:`, message);
          return {
            name: folder.name,
            path: folder.path,
            thumbnail: null,
            count: 0
          };
        }
      })
    );
    return foldersWithThumbnails;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không rõ lỗi";
    console.error("Không thể tải danh sách album:", message);
    return [];
  }
}

export default async function HomePage() {
  const folders = await getFolders();
  const featuredFolders = folders.filter((folder) => folder.thumbnail).slice(0, 4);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto grid w-full max-w-[1800px] gap-8 px-4 py-10 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-600">
              Thư viện cá nhân
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl">
              Lưu giữ ảnh và video theo từng album rõ ràng.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Duyệt nhanh, xem toàn màn hình, tải xuống và quản lý nội dung từ một giao diện tiếng Việt gọn gàng.
            </p>
          </div>

          <div className="min-w-[260px] rounded-2xl border bg-muted/25 p-4 lg:min-w-[420px]">
            {featuredFolders.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {featuredFolders.map((folder, index) => (
                  <div
                    key={folder.path}
                    className={`relative overflow-hidden rounded-xl bg-muted ${index === 0 ? "col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`}
                  >
                    <Image
                      src={folder.thumbnail || ""}
                      alt={`Ảnh nổi bật album ${formatAlbumName(folder.name)}`}
                      fill
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-3 right-3 truncate text-sm font-bold capitalize text-white">
                      {formatAlbumName(folder.name)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center rounded-xl border-2 border-dashed bg-background text-center">
                <div>
                  <p className="text-lg font-black">Chưa có ảnh nổi bật</p>
                  <p className="mt-2 text-sm text-muted-foreground">Tải ảnh đầu tiên để khu vực này tự cập nhật.</p>
                </div>
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                <p className="text-sm font-medium text-muted-foreground">Album</p>
                <p className="mt-2 text-3xl font-black">{folders.length}</p>
              </div>
              <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                <p className="text-sm font-medium text-muted-foreground">Tổng tệp</p>
                <p className="mt-2 text-3xl font-black">
                  {folders.reduce((total, folder) => total + folder.count, 0)}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-foreground p-4 text-background">
                <p className="text-sm font-semibold opacity-75">Cập nhật</p>
                <p className="mt-2 text-lg font-bold">Dữ liệu tự làm mới mỗi 60 giây</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1800px] px-4 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-600">Bộ sưu tập</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">Tất cả album</h2>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{folders.length} album đang hiển thị</p>
        </div>

        {folders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed bg-background py-24 text-center">
            <p className="text-2xl font-bold text-foreground">Thư viện chưa có album.</p>
            <p className="mt-3 text-lg text-muted-foreground">Vào trang quản trị để tạo album và tải ảnh hoặc video đầu tiên.</p>
          </div>
        ) : (
          <AlbumGrid initialFolders={folders} />
        )}
      </section>
    </main>
  );
}
