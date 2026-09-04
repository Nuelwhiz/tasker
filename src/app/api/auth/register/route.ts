import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, orgName } = await req.json();

    if (!email || !password || !name || !orgName) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, password, orgName)" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const slug = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Return both user and org from the transaction to construct complete token claims
    const { user, organization } = await db.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
        },
      });

      const newOrg = await tx.organization.create({
        data: {
          name: orgName,
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: newOrg.id,
          userId: newUser.id,
          role: "ORGANIZATION_ADMIN",
        },
      });

      return { user: newUser, organization: newOrg };
    });

    // Populate initial JWT session with the newly created organization membership
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      systemRole: user.systemRole as "USER" | "SUPER_ADMIN",
      memberships: [
        {
          organizationId: organization.id,
          role: "ORGANIZATION_ADMIN",
        },
      ],
    });

    const response = NextResponse.json(
      {
        message: "Registration successful",
        userId: user.id,
        organizationSlug: organization.slug,
      },
      { status: 201 }
    );

    response.cookies.set("tasker_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}