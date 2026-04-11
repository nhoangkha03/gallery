export const COLLECTION_ORDER: string[] = [
  "Mùa hè xanh",
  "Kỉ niệm",
  "Badminton",
];

export function sortFolders(folders: any[]) {
  return folders.sort((a, b) => {
    const indexA = COLLECTION_ORDER.indexOf(a.name);
    const indexB = COLLECTION_ORDER.indexOf(b.name);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Nếu không có trong danh sách cố định, sắp xếp theo bảng chữ cái A-Z
    return a.name.localeCompare(b.name);
  });
}
