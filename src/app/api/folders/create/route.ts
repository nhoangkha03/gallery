import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";

interface CreateFolderPayload {
  folderName?: string;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const { folderName } = await request.json() as CreateFolderPayload;

    if (!folderName) {
      return NextResponse.json({ error: "Vui lòng nhập tên album." }, { status: 400 });
    }

    const result = await cloudinary.api.create_folder(folderName);

    revalidatePath("/");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Không thể tạo album:", error);
    return NextResponse.json({ error: "Không thể tạo album." }, { status: 500 });
  }
}
