import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";

interface DeletePayload {
  publicId?: string;
  resourceType?: string;
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const { publicId, resourceType } = await request.json() as DeletePayload;

    if (!publicId) {
      return NextResponse.json({ error: "Thiếu mã tệp cần xóa." }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });

    const folder = publicId.split("/").slice(0, -1).join("/");
    revalidatePath("/");
    if (folder) revalidatePath(`/album/${encodeURIComponent(folder)}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Không thể xóa tệp:", error);
    return NextResponse.json({ error: "Không thể xóa tệp." }, { status: 500 });
  }
}
