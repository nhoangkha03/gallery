import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "Chưa có tệp nào được tải lên." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder || "gallery",
          resource_type: "auto",
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Cloudinary không trả kết quả upload."));
        }
      ).end(buffer);
    });

    revalidatePath("/");
    if (folder) revalidatePath(`/album/${encodeURIComponent(folder)}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Không thể tải tệp lên:", error);
    return NextResponse.json({ error: "Không thể tải tệp lên." }, { status: 500 });
  }
}
