import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ folderName: string }> }
) {
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

    return NextResponse.json({
      success: true,
      resources: deleteResourcesResult,
      folder: deleteFolderResult
    });
  } catch (error) {
    console.error(`Error deleting folder ${decodedFolder}:`, error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
