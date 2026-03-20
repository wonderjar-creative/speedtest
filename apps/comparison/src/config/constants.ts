export const PAGES = [
  { name: "Home", path: "/", starred: true },
  { name: "About", path: "/about", starred: false },
  { name: "Services", path: "/services", starred: true },
  { name: "Portfolio", path: "/portfolio", starred: true },
  { name: "Blog", path: "/blog", starred: false },
  { name: "Contact", path: "/contact", starred: false },
] as const;

export const METRICS = {
  traditional: {
    lighthouse: 48,
    lcp: "4.2s",
    fcp: "2.1s",
    tbt: "750ms",
    cls: "0.18",
  },
  headless: {
    lighthouse: 97,
    lcp: "0.6s",
    fcp: "0.3s",
    tbt: "40ms",
    cls: "0.01",
  },
} as const;

export const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SLOW_SITE_URL ?? "https://slow.speedtest.denverheadless.com",
  process.env.NEXT_PUBLIC_FAST_SITE_URL ?? "https://fast.speedtest.denverheadless.com",
];
