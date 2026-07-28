import type { CloudinaryFolder } from "@/lib/gallery";

export const COLLECTION_ORDER: string[] = [
  "Mùa hè xanh",
  "Kỉ niệm",
  "Badminton",
];

export function sortFolders<T extends CloudinaryFolder>(folders: T[]) {
  return [...folders].sort((a, b) => {
    const indexA = COLLECTION_ORDER.indexOf(a.name);
    const indexB = COLLECTION_ORDER.indexOf(b.name);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.name.localeCompare(b.name, "vi");
  });
}
