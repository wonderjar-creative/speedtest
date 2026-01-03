import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * WordPress Preview Handler
 *
 * Enables draft mode for previewing unpublished content.
 *
 * WordPress sends users to this endpoint with a JWT token.
 * We validate the token and enable Next.js draft mode.
 *
 * Configure WordPress to use this preview URL:
 * https://your-frontend.com/api/preview?token=JWT_TOKEN&id=POST_ID
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  if (!token || !id) {
    return new Response("Missing token or id", { status: 400 });
  }

  try {
    // Validate JWT token with WordPress
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return new Response("Invalid token", { status: 401 });
    }

    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    // Store JWT in cookie for authenticated GraphQL requests
    const cookieStore = await cookies();
    cookieStore.set("wp_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    // Redirect to preview URL
    redirect(`/preview/${id}`);
  } catch (error) {
    console.error("Preview error:", error);
    return new Response("Preview failed", { status: 500 });
  }
}
