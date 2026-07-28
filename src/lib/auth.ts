import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "gallery_admin";

function getAdminSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

export function createAdminToken() {
  const secret = getAdminSecret();
  if (!secret) return "";

  return createHmac("sha256", secret).update("gallery-admin-session").digest("hex");
}

export function isAdminRequest(request: NextRequest) {
  const expected = createAdminToken();
  const actual = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!expected || !actual) return false;

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Bạn cần đăng nhập quản trị." }, { status: 401 });
}
