export default function CTA() {
  return (
    <section className="py-16 px-4 text-center border-t border-surface-alt">
      <h2 className="text-2xl md:text-3xl font-bold">
        Ready to make your site this fast?
      </h2>
      <p className="mt-3 text-foreground/60 max-w-md mx-auto">
        Denver Headless builds blazing-fast headless WordPress sites on ethical
        infrastructure. Same backend your team already knows, dramatically better
        performance.
      </p>
      <a
        href="https://denverheadless.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 bg-teal text-background font-semibold px-6 py-2.5 rounded hover:bg-teal-dark transition-colors"
      >
        Learn More
      </a>
    </section>
  );
}
