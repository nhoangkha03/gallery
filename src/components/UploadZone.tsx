"use client";

import { useEffect, useState } from "react";
import { FolderPlus, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UploadZoneProps {
  folders: string[];
  onUploadSuccess: () => void;
}

export default function UploadZone({ folders, onUploadSuccess }: UploadZoneProps) {
  const [selectedFolder, setSelectedFolder] = useState(folders[0] || "");
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (!selectedFolder && folders[0]) {
      setSelectedFolder(folders[0]);
    }
  }, [folders, selectedFolder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    if (!selectedFolder) {
      toast.error("Vui lòng tạo hoặc chọn album trước khi tải lên.");
      return;
    }
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    setUploadProgress({ current: 0, total: files.length });
    
    try {
      for (const [index, file] of files.entries()) {
        setUploadProgress({ current: index + 1, total: files.length });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", selectedFolder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Tải lên thất bại");
        }
      }
      
      toast.success("Đã tải tất cả tệp lên thành công.");
      onUploadSuccess();
      e.target.value = "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tải lên thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleCreateFolder = async () => {
    const folderName = newFolderName.trim();
    if (!folderName) return;
    setIsCreatingFolder(true);
    
    try {
      const res = await fetch("/api/folders/create", {
        method: "POST",
        body: JSON.stringify({ folderName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Không thể tạo album");
      }
      
      toast.success(`Đã tạo album "${folderName}".`);
      setNewFolderName("");
      setSelectedFolder(folderName);
      onUploadSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể tạo album.";
      toast.error(message);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="grid gap-8 rounded-2xl border bg-background p-5 shadow-sm md:p-6">
      <div>
        <Label className="mb-4 block text-lg font-bold">1. Tạo album mới</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Tên album, ví dụ: Du lịch Đà Lạt"
            className="h-11 rounded-xl"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button onClick={handleCreateFolder} disabled={isCreatingFolder} className="h-11 rounded-xl px-4">
            {isCreatingFolder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
            Tạo album
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-4 block text-lg font-bold">2. Tải ảnh và video lên</Label>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm text-muted-foreground">Chọn album đích</Label>
            <select
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              disabled={folders.length === 0}
            >
              {folders.length === 0 && <option value="">Chưa có album</option>}
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {selectedFolder && (
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Tệp mới sẽ được lưu vào album <span className="font-bold text-foreground">{selectedFolder}</span>.
              </p>
            )}
          </div>
          
          <div className="relative flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/20 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30">
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">Bấm để chọn tệp hoặc kéo thả vào đây</p>
            <p className="mt-2 text-sm text-muted-foreground">Hỗ trợ tải nhiều ảnh và video trong một lần.</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleUpload}
              disabled={isUploading || !selectedFolder}
            />
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-background/90 px-8 text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin" />
                <span className="font-bold">Đang tải lên {uploadProgress.current}/{uploadProgress.total}</span>
                <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{
                      width: `${uploadProgress.total ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
