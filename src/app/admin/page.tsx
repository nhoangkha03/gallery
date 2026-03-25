"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadZone from "@/components/UploadZone";
import Link from "next/link";

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

      <div className="max-w-4xl mx-auto px-4">
        <UploadZone folders={folders} onUploadSuccess={fetchFolders} />
      </div>
    </main>
  );
}
