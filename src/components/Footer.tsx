import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-3" aria-label="Về trang chủ Ký ức số">
          <BrandLogo />
        </Link>
        <p className="font-medium">
          Lưu giữ khoảnh khắc, xem nhanh và quản lý gọn gàng trong một thư viện riêng.
        </p>
      </div>
    </footer>
  );
}
