"use client";

import { useState } from "react";
import metricsData from "../../public/metrics.json";

type Device = "mobile" | "desktop";

interface DeviceMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  lcp: number;
  fcp: number;
  tbt: number;
  cls: number;
  si: number;
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatCls(cls: number): string {
  return cls.toFixed(2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function MetricValue({
  label,
  value,
  color,
  large,
}: {
  label: string;
  value: string | number;
  color: "red" | "green";
  large?: boolean;
}) {
  const colorClass = color === "red" ? "text-red" : "text-green";
  return (
    <div className="text-center">
      <div
        className={`${colorClass} font-bold ${large ? "text-3xl md:text-4xl" : "text-lg md:text-xl"} font-mono`}
      >
        {value}
      </div>
      <div className="text-foreground/50 text-xs mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function MetricsRow({
  metrics,
  color,
}: {
  metrics: DeviceMetrics;
  color: "red" | "green";
}) {
  return (
    <div className="flex items-end justify-center gap-4 md:gap-6">
      <MetricValue
        label="Lighthouse"
        value={metrics.performance}
        color={color}
        large
      />
      <MetricValue label="LCP" value={formatMs(metrics.lcp)} color={color} />
      <MetricValue label="FCP" value={formatMs(metrics.fcp)} color={color} />
      <MetricValue label="TBT" value={formatMs(metrics.tbt)} color={color} />
      <MetricValue label="CLS" value={formatCls(metrics.cls)} color={color} />
    </div>
  );
}

export default function MetricsPanel() {
  const [device, setDevice] = useState<Device>("mobile");
  const slow: DeviceMetrics = metricsData.runs.slow[device];
  const fast: DeviceMetrics = metricsData.runs.fast[device];

  return (
    <section className="bg-surface border-y border-surface-alt py-6 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center mb-5">
          <div className="inline-flex bg-background rounded-full p-1 border border-surface-alt">
            {(["mobile", "desktop"] as Device[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-4 py-1 text-xs uppercase tracking-wider font-semibold rounded-full transition-colors ${
                  device === d
                    ? "bg-teal text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 divide-x divide-surface-alt">
          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-red-muted uppercase tracking-wider">
              Traditional WordPress
            </div>
            <MetricsRow metrics={slow} color="red" />
          </div>

          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-green-muted uppercase tracking-wider">
              Headless
            </div>
            <MetricsRow metrics={fast} color="green" />
          </div>
        </div>

        <p className="text-center text-foreground/40 text-xs mt-4">
          Nightly Lighthouse audit · {formatDate(metricsData.generatedAt)}
        </p>
      </div>
    </section>
  );
}
