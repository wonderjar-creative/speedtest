import { METRICS } from "@/config/constants";

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
      <div className="text-foreground/40 text-xs mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function MetricsPanel() {
  return (
    <section className="bg-surface border-y border-surface-alt py-6 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:gap-8 divide-x divide-surface-alt">
          {/* Traditional side */}
          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-red-muted uppercase tracking-wider">
              Traditional WordPress
            </div>
            <div className="flex items-end justify-center gap-4 md:gap-6">
              <MetricValue label="Lighthouse" value={METRICS.traditional.lighthouse} color="red" large />
              <MetricValue label="LCP" value={METRICS.traditional.lcp} color="red" />
              <MetricValue label="FCP" value={METRICS.traditional.fcp} color="red" />
              <MetricValue label="TBT" value={METRICS.traditional.tbt} color="red" />
              <MetricValue label="CLS" value={METRICS.traditional.cls} color="red" />
            </div>
          </div>

          {/* Headless side */}
          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-green-muted uppercase tracking-wider">
              Headless
            </div>
            <div className="flex items-end justify-center gap-4 md:gap-6">
              <MetricValue label="Lighthouse" value={METRICS.headless.lighthouse} color="green" large />
              <MetricValue label="LCP" value={METRICS.headless.lcp} color="green" />
              <MetricValue label="FCP" value={METRICS.headless.fcp} color="green" />
              <MetricValue label="TBT" value={METRICS.headless.tbt} color="green" />
              <MetricValue label="CLS" value={METRICS.headless.cls} color="green" />
            </div>
          </div>
        </div>

        <p className="text-center text-foreground/30 text-xs mt-4">
          Based on Lighthouse audit, March 2026
        </p>
      </div>
    </section>
  );
}
