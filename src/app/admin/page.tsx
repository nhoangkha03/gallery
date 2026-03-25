"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, ChevronLeft, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadZone from "@/components/UploadZone";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [folders, setFolders] = useState<string[]>([]);

  const fetchFolders = async () => {
    const res = await fetch("/api/folders");
    if (res.ok) {
      const data = await res.json();
      setFolders(data.map((f: any) => f.name));
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("is_admin");
    if (saved === "true") {
      setIsAdmin(true);
      fetchFolders();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { // Simplified for demo, should use env in real app
      setIsAdmin(true);
      localStorage.setItem("is_admin", "true");
      fetchFolders();
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("is_admin");
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!confirm(`Are you sure you want to delete "${folderName}" and all its contents? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/folders/${encodeURIComponent(folderName)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Collection "${folderName}" deleted successfully`);
        fetchFolders();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete folder");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete collection");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8 bg-card p-8 rounded-3xl border shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
          <div className="text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-muted-foreground mt-2 font-medium italic">Secure control center</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="System Password"
              className="h-12 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Authenticate
            </Button>
          </div>
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
              Return to Public Gallery
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="bg-muted/30 border-b relative py-12 mb-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <ShieldCheck className="w-4 h-4" />
              Administrative Control
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Management Console</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="w-fit rounded-xl border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <UploadZone folders={folders} onUploadSuccess={fetchFolders} />
        
        <section className="bg-card p-8 rounded-3xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </span>
            Manage Collections
          </h2>
          
          <div className="grid gap-4">
            {folders.length === 0 ? (
              <p className="text-muted-foreground italic">No collections found.</p>
            ) : (
              folders.map((folder) => (
                <div key={folder} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-muted/40 transition-all group">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">{folder.replace(/-/g, " ")}</h3>
                    <p className="text-sm text-muted-foreground">{folder}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteFolder(folder)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
