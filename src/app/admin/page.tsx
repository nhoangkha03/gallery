"use client";

import { useState, useEffect } from "react";
import { Folder, Lock, LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadZone from "@/components/UploadZone";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [folders, setFolders] = useState<string[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchFolders = async () => {
    const res = await fetch("/api/folders");
    if (res.ok) {
      const data = await res.json() as Array<{ name: string }>;
      setFolders(data.map((f) => f.name));
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json() as { isAdmin: boolean };
        setIsAdmin(data.isAdmin);
        if (data.isAdmin) {
          localStorage.setItem("is_admin", "true");
          await fetchFolders();
        } else {
          localStorage.removeItem("is_admin");
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Không thể đăng nhập.");
      }

      setIsAdmin(true);
      localStorage.setItem("is_admin", "true");
      await fetchFolders();
      toast.success("Đăng nhập quản trị thành công.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể đăng nhập.";
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
    localStorage.removeItem("is_admin");
    toast.success("Đã đăng xuất.");
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!confirm(`Bạn chắc chắn muốn xóa album "${folderName}" cùng toàn bộ nội dung bên trong? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/folders/${encodeURIComponent(folderName)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Đã xóa album "${folderName}".`);
        fetchFolders();
      } else {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Không thể xóa album");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa album.";
      toast.error(message);
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
        <div className="flex items-center gap-3 rounded-2xl border bg-background px-5 py-4 shadow-sm">
          <LoaderIcon />
          <span className="font-semibold">Đang kiểm tra quyền truy cập...</span>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,var(--background),oklch(0.985_0.01_95))] p-4">
        <form onSubmit={handleLogin} className="group relative w-full max-w-sm overflow-hidden rounded-2xl border bg-card p-8 shadow-xl">
          <div className="absolute left-0 top-0 h-1 w-full bg-amber-500" />
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-3">
              <Lock className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Khu vực quản trị</h1>
            <p className="mt-2 font-medium text-muted-foreground">Đăng nhập để tải lên, tạo album và xóa nội dung.</p>
          </div>
          <div className="mt-8 space-y-4">
            <Input
              type="password"
              placeholder="Mật khẩu quản trị"
              className="h-12 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="h-12 w-full rounded-xl text-base font-bold transition-all active:scale-[0.98]" disabled={isLoggingIn}>
              {isLoggingIn && <LoaderIcon />}
              Đăng nhập
            </Button>
          </div>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Quay lại thư viện công khai
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--background),oklch(0.985_0.01_95))] pb-20">
      <header className="relative mb-10 border-b bg-background py-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-6 px-4 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-600">
              <ShieldCheck className="h-4 w-4" />
              Bảng điều khiển
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Quản lý thư viện</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Tạo album, tải media và dọn nội dung cũ trong một nơi.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="h-11 w-fit rounded-xl border-2 transition-all hover:border-destructive hover:bg-destructive hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] space-y-10 px-4">
        <UploadZone folders={folders} onUploadSuccess={fetchFolders} />
        
        <section className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Folder className="h-5 w-5" />
            </span>
            Danh sách album
          </h2>
          
          <div className="grid gap-4">
            {folders.length === 0 ? (
              <p className="text-muted-foreground">Chưa có album nào.</p>
            ) : (
              folders.map((folder) => (
                <div key={folder} className="group flex items-center justify-between rounded-2xl border border-transparent bg-muted/20 p-4 transition-all hover:border-primary/20 hover:bg-muted/40">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold capitalize">{folder.replace(/-/g, " ")}</h3>
                    <p className="text-sm text-muted-foreground">{folder}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl text-muted-foreground opacity-0 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    onClick={() => handleDeleteFolder(folder)}
                    title="Xóa album"
                  >
                    <Trash2 className="h-5 w-5" />
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

function LoaderIcon() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />;
}
