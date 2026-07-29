import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-20">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-600">Không tìm thấy</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight">Trang này không tồn tại.</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Đường dẫn có thể đã thay đổi hoặc album bạn đang tìm đã bị xóa.
        </p>
        <Button asChild className="mt-8 h-11 rounded-xl px-5">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </main>
  );
}
