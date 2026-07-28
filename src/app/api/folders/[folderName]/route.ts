import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderName: string }> }
) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  const { folderName } = await params;
  const decodedFolder = decodeURIComponent(folderName);

  try {
    // 1. Delete all resources in the folder
    // Note: delete_resources_by_prefix deletes all resources whose public ID starts with the prefix.
    // Cloudinary folders are usually prefixes.
    const deleteResourcesResult = await cloudinary.api.delete_resources_by_prefix(decodedFolder);
    
    // 2. Delete the folder itself
    // Note: The folder must be empty to be deleted.
    const deleteFolderResult = await cloudinary.api.delete_folder(decodedFolder);

    revalidatePath("/");
    revalidatePath(`/album/${encodeURIComponent(decodedFolder)}`);

    return NextResponse.json({
      success: true,
      resources: deleteResourcesResult,
      folder: deleteFolderResult
    });
  } catch (error) {
    console.error(`Không thể xóa album ${decodedFolder}:`, error);
    return NextResponse.json({ error: "Không thể xóa album." }, { status: 500 });
  }
}
