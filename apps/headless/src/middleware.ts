import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RankMathRedirect {
  sources: Array<{
    pattern: string;
    comparison: string;
  }>;
  url_to: string;
  header_code: string;
}

/**
 * Check Rank Math for redirects
 */
async function checkRankMathRedirects(
  pathname: string,
): Promise<{ url: string; code: number } | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/rankmath/v1/getRedirection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: pathname }),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return null;

    const data: RankMathRedirect = await response.json();

    if (data?.url_to) {
      return {
        url: data.url_to,
        code: parseInt(data.header_code) || 301,
      };
    }
  } catch (error) {
    console.error("Rank Math redirect check failed:", error);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  // Skip redirect checks if WordPress URL is not configured (local dev without WP)
  if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    return NextResponse.next();
  }

  const pathnameWithoutTrailingSlash = request.nextUrl.pathname.replace(
    /\/$/,
    "",
  );

  // Check Rank Math for redirects
  const rankMathRedirect = await checkRankMathRedirects(
    pathnameWithoutTrailingSlash,
  );

  if (rankMathRedirect) {
    const newUrl = new URL(
      rankMathRedirect.url,
      process.env.NEXT_PUBLIC_BASE_URL,
    ).toString();

    return NextResponse.redirect(newUrl, {
      status: rankMathRedirect.code === 301 ? 308 : 307,
    });
  }

  return NextResponse.next();
}
