export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
        Same server. Same content. Same backend.{" "}
        <span className="text-teal">Half the load time.</span>
      </h1>
      <p className="mt-4 text-foreground/60 text-lg max-w-xl">
        See the difference headless architecture makes — a real WordPress site,
        rendered two ways, on the same server.
      </p>
      <a
        href="#comparison"
        className="mt-8 text-teal text-sm font-medium hover:text-teal-dark transition-colors"
      >
        See it live ↓
      </a>
    </section>
  );
}
