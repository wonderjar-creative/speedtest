export const nextSlugToWpSlug = (nextSlug: string | string[] | undefined): string =>
  nextSlug && Array.isArray(nextSlug) ? nextSlug.join("/") : (nextSlug as string) ?? "/";
