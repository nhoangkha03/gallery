import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    // Cloudinary folders API requires the "gallery" prefix if you organized it that way
    // For simplicity, we'll list all root folders first
    const { folders } = await cloudinary.api.root_folders();
    
    // Also fetch the first image of each folder to use as a thumbnail
    const foldersWithThumbnails = await Promise.all(
      folders.map(async (folder: any) => {
        // Fetch count and thumbnail properly
        const { resources, total_count } = await cloudinary.search
          .expression(`folder:"${folder.name}"`)
          .sort_by("public_id", "desc")
          .execute();
        
        return {
          name: folder.name,
          path: folder.path,
          thumbnail: resources[0]?.secure_url || null,
          count: total_count || resources.length,
        };
      })
    );

    return NextResponse.json(foldersWithThumbnails);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}
