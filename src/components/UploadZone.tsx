"use client";

import { useState } from "react";
import { Upload, Plus, Loader2 } from "lucide-react";
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", selectedFolder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
      }
      
      toast.success("All files uploaded successfully!");
      onUploadSuccess();
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    setIsCreatingFolder(true);
    
    try {
      const res = await fetch("/api/folders/create", {
        method: "POST",
        body: JSON.stringify({ folderName: newFolderName }),
      });

      if (!res.ok) throw new Error("Failed to create folder");
      
      toast.success(`Folder "${newFolderName}" created!`);
      setNewFolderName("");
      onUploadSuccess();
    } catch (error) {
      toast.error("Failed to create folder.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="grid gap-8 p-6 bg-muted/30 rounded-xl border">
      <div>
        <Label className="text-lg font-semibold mb-4 block">1. Create New Album</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Album name (e.g. Summer Vacation)"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button onClick={handleCreateFolder} disabled={isCreatingFolder}>
            {isCreatingFolder ? <Loader2 className="animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Create
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">2. Upload Photos/Videos</Label>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Choose Destination</Label>
            <select
              className="w-full p-2 rounded-md border bg-background"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          
          <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center relative">
            <Upload className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Click or drag and drop to upload</p>
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <Loader2 className="animate-spin w-8 h-8 mr-2" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
