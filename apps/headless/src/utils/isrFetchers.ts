const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:3000';

export async function fetchTemplateWithISR(slug: string) {
  try {
    const res = await fetch(`${WP_URL}/wp-json/template-structure/v1/templates/${slug}`, {
      next: { revalidate: 300 }, // 5 minutes
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('ISR template fetch error:', error);
    return null;
  }
}

export async function fetchTemplatePartWithISR(slug: string) {
  try {
    const res = await fetch(`${WP_URL}/wp-json/template-structure/v1/parts/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('ISR template part fetch error:', error);
    return null;
  }
}

export async function fetchPatternWithISR(slug: string) {
  try {
    const res = await fetch(`${WP_URL}/wp-json/template-structure/v1/patterns/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('ISR pattern fetch error:', error);
    return null;
  }
}
