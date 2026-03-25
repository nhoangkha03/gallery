import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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
      .execute();

    return NextResponse.json(resources);
  } catch (error) {
    console.error(`Error fetching media for folder ${decodedFolder}:`, error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
