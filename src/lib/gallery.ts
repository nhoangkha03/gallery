export type CloudinaryResourceType = "image" | "video" | "raw" | "auto" | string;

export interface CloudinaryFolder {
  name: string;
  path: string;
}

export interface GalleryFolder extends CloudinaryFolder {
  thumbnail: string | null;
  count: number;
}

export interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: CloudinaryResourceType;
  format: string;
}

export interface CloudinarySearchResponse {
  resources: MediaItem[];
  total_count?: number;
  next_cursor?: string;
}

export function formatAlbumName(name: string) {
  return name.replace(/-/g, " ").trim();
}

export function getAssetName(publicId: string) {
  return publicId.split("/").pop() || "Tệp media";
}

export function getPreviewUrl(item?: Pick<MediaItem, "secure_url" | "resource_type"> | null) {
  if (!item?.secure_url) return null;

  if (item.resource_type === "video") {
    return item.secure_url.replace(/\.[^/.]+$/, ".jpg");
  }

  return item.secure_url;
}

export function pluralizeAsset(count: number) {
  return `${count} ${count === 1 ? "tệp" : "tệp"}`;
}
