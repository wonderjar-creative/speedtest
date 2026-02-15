import { NextRequest, NextResponse } from 'next/server';
import getPart from '@/utils/getPart';

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  const slug = params.slug;

  try {
    const wpRes = await fetch(`${WP_API}/wp-json/template-structure/v1/parts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });

    if (wpRes.ok) {
      const data = await wpRes.json();
      return NextResponse.json(data);
    }

    const fallback = getPart(slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ message: 'Template part not found' }, { status: 404 });
  } catch (error) {
    console.error('Template part fetch error:', error);

    const fallback = getPart(slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ message: 'Fetch failed' }, { status: 500 });
  }
}
