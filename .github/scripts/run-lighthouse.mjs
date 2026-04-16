import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SLOW_URL = process.env.SLOW_URL;
const FAST_URL = process.env.FAST_URL;
const OUTPUT_PATH = resolve(process.env.OUTPUT_PATH);
const RUNS_PER_AUDIT = 3;

const median = (nums) => {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const runLighthouse = (url, strategy) => {
  const tmp = `/tmp/lh-${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
  const preset = strategy === 'desktop' ? '--preset=desktop' : '';
  execSync(
    `lighthouse "${url}" ${preset} --output=json --output-path="${tmp}" --chrome-flags="--headless=new --no-sandbox" --quiet`,
    { stdio: 'inherit' }
  );
  const report = JSON.parse(readFileSync(tmp, 'utf-8'));
  unlinkSync(tmp);

  const c = report.categories;
  const a = report.audits;
  return {
    performance: Math.round(c.performance.score * 100),
    accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: Math.round(a['largest-contentful-paint'].numericValue),
    fcp: Math.round(a['first-contentful-paint'].numericValue),
    tbt: Math.round(a['total-blocking-time'].numericValue),
    cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
    si: Math.round(a['speed-index'].numericValue),
  };
};

const auditMedian = (url, strategy) => {
  console.log(`\n→ ${strategy} ${url} (${RUNS_PER_AUDIT} runs)`);
  const runs = [];
  for (let i = 0; i < RUNS_PER_AUDIT; i++) {
    console.log(`  run ${i + 1}/${RUNS_PER_AUDIT}`);
    runs.push(runLighthouse(url, strategy));
  }
  const keys = Object.keys(runs[0]);
  return Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))]));
};

const auditSite = (url) => ({
  url,
  mobile: auditMedian(url, 'mobile'),
  desktop: auditMedian(url, 'desktop'),
});

const result = {
  generatedAt: new Date().toISOString(),
  runs: {
    slow: auditSite(SLOW_URL),
    fast: auditSite(FAST_URL),
  },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n');
console.log(`\n✓ wrote ${OUTPUT_PATH}`);
