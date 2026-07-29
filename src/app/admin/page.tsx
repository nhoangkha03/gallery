"use client";

import { useState, useEffect } from "react";
import { Database, Folder, Lock, LogOut, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadZone from "@/components/UploadZone";
import Link from "next/link";
import { toast } from "sonner";

interface AdminFolder {
  name: string;
  count: number;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [folders, setFolders] = useState<AdminFolder[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const folderNames = folders.map((folder) => folder.name);
  const totalItems = folders.reduce((total, folder) => total + folder.count, 0);

  const fetchFolders = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/folders");
      if (res.ok) {
        const data = await res.json() as Array<{ name: string; count?: number }>;
        setFolders(data.map((f) => ({ name: f.name, count: f.count || 0 })));
      }
    } finally {
      setIsRefreshing(false);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
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
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">Tổng album</p>
              <Folder className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-4xl font-black">{folders.length}</p>
          </div>
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">Tổng tệp</p>
              <Database className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-4xl font-black">{totalItems}</p>
          </div>
          <div className="rounded-2xl border bg-foreground p-5 text-background shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold opacity-75">Phiên quản trị</p>
              <ShieldCheck className="h-5 w-5 text-amber-300" />
            </div>
            <p className="mt-3 text-xl font-black">Đang hoạt động</p>
            <p className="mt-2 text-sm opacity-75">Cookie bảo mật có hiệu lực trong 8 giờ.</p>
          </div>
        </div>

        <UploadZone folders={folderNames} onUploadSuccess={fetchFolders} />
        
        <section className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Folder className="h-5 w-5" />
              </span>
              Danh sách album
            </h2>
            <Button
              variant="outline"
              onClick={fetchFolders}
              disabled={isRefreshing}
              className="h-10 w-fit rounded-xl"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
          
          <div className="grid gap-4">
            {folders.length === 0 ? (
              <p className="text-muted-foreground">Chưa có album nào.</p>
            ) : (
              folders.map((folder) => (
                <div key={folder.name} className="group flex items-center justify-between rounded-2xl border border-transparent bg-muted/20 p-4 transition-all hover:border-primary/20 hover:bg-muted/40">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold capitalize">{folder.name.replace(/-/g, " ")}</h3>
                    <p className="text-sm text-muted-foreground">{folder.name} · {folder.count} tệp</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl text-muted-foreground opacity-0 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    onClick={() => handleDeleteFolder(folder.name)}
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
