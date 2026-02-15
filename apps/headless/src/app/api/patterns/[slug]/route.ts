import { NextRequest, NextResponse } from 'next/server';
import getPattern from '@/utils/getPattern';

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  const slug = params.slug;

  try {
    const wpRes = await fetch(`${WP_API}/wp-json/template-structure/v1/patterns/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });

    if (wpRes.ok) {
      const data = await wpRes.json();
      return NextResponse.json(data);
    }

    const fallback = getPattern(slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ message: 'Pattern not found' }, { status: 404 });
  } catch (error) {
    console.error('Pattern fetch error:', error);

    const fallback = getPattern(slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ message: 'Fetch failed' }, { status: 500 });
  }
}
