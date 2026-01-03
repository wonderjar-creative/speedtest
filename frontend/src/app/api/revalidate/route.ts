import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * ISR Revalidation endpoint
 *
 * Called by WordPress webhooks to invalidate cached pages.
 *
 * Usage:
 * POST /api/revalidate
 * Headers: x-headless-secret: your-secret
 *
 * Configure in WordPress with a plugin like "WP Webhooks" or custom code.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-headless-secret");

  if (secret !== process.env.HEADLESS_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate all WordPress content
    revalidateTag("wordpress");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
