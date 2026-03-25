import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { folderName } = await request.json();

    if (!folderName) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const result = await cloudinary.api.create_folder(folderName);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
