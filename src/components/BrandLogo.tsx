import { Images } from "lucide-react";

interface BrandLogoProps {
  compact?: boolean;
}

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Images className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-lg font-black leading-tight tracking-tight text-foreground">
            Ký ức số
          </span>
          <span className="block truncate text-xs font-semibold text-muted-foreground">
            Thư viện ảnh & video
          </span>
        </span>
      )}
    </span>
  );
}
