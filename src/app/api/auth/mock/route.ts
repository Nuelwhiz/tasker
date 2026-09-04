import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "tasker-super-secret-jwt-key-2026-secure"
);

export async function GET(request: Request) {
  const token = await new SignJWT({
    userId: "usr_101",
    email: "emmanuel@example.com",
    memberships: [
      {
        organizationId: "org_acme_101",
        orgName: "Acme Corp",
        role: "ORGANIZATION_ADMIN",
      },
      {
        organizationId: "org_stark_202",
        orgName: "Stark Tech",
        role: "TEAM_LEAD",
      },
    ],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  response.cookies.set("tasker_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}