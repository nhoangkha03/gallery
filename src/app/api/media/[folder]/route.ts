import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { CloudinarySearchResponse } from "@/lib/gallery";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;
  const decodedFolder = decodeURIComponent(folder);

  try {
    const { resources } = await cloudinary.search
      .expression(`folder:"${decodedFolder}"`)
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute() as CloudinarySearchResponse;

    return NextResponse.json(resources);
  } catch (error) {
    console.error(`Không thể tải media trong album ${decodedFolder}:`, error);
    return NextResponse.json({ error: "Không thể tải media" }, { status: 500 });
  }
}
