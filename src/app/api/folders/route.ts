import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { sortFolders } from "@/lib/config";
import type { CloudinaryFolder, CloudinarySearchResponse, GalleryFolder } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { folders } = await cloudinary.api.root_folders() as { folders?: CloudinaryFolder[] };
    
    const sortedFolders = sortFolders(folders || []);
    
    const foldersWithThumbnails = await Promise.all(
      sortedFolders.map(async (folder): Promise<GalleryFolder> => {
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
      })
    );

    return NextResponse.json(foldersWithThumbnails);
  } catch (error) {
    console.error("Không thể tải danh sách album:", error);
    return NextResponse.json({ error: "Không thể tải danh sách album" }, { status: 500 });
  }
}
