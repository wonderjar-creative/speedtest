import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl text-gray-600 mb-4">Page not found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary text-white rounded-md font-semibold no-underline hover:bg-accent transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
