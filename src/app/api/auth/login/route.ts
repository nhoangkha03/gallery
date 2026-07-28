import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminToken } from "@/lib/auth";

interface LoginPayload {
  password?: string;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json() as LoginPayload;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const token = createAdminToken();

  if (!adminPassword || !token) {
    return NextResponse.json(
      { error: "Chưa cấu hình ADMIN_PASSWORD trên server." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
