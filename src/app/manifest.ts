import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ký ức số",
    short_name: "Ký ức số",
    description: "Thư viện ảnh và video cá nhân bằng tiếng Việt.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdfa",
    theme_color: "#111827",
    icons: [
      {
        src: "/icon.svg",
        sizes: "128x128",
        type: "image/svg+xml",
      },
    ],
  };
}
