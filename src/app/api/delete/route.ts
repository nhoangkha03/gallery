import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(request: Request) {
  try {
    const { publicId, resourceType } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
