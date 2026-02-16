/**
 * JSON-LD Structured Data Component
 *
 * Renders JSON-LD structured data from Rank Math SEO in a script tag.
 */

type JsonLdProps = {
  data?: string | null;
};

/**
 * Extracts JSON content from Rank Math's raw output.
 * Rank Math returns the full <script> element, so we need to extract just the JSON.
 */
function extractJsonFromRankMath(data: string): string | null {
  // Check if the data contains a script tag (Rank Math's format)
  if (data.includes("<script")) {
    // Extract JSON content from between script tags
    const match = data.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
    );
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  }
  // If no script tag, return data as-is (already JSON)
  return data;
}

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  // Extract JSON from Rank Math's script tag wrapper
  const jsonContent = extractJsonFromRankMath(data);
  if (!jsonContent) return null;

  // Validate and normalize the JSON
  let jsonLdContent: string;

  try {
    // Parse and re-stringify to ensure valid JSON
    const parsed = JSON.parse(jsonContent);
    jsonLdContent = JSON.stringify(parsed);
  } catch {
    // If parsing fails, use the extracted content as-is
    jsonLdContent = jsonContent;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdContent }}
    />
  );
}
