import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-20">
        <Link href="/" className="text-xl font-serif font-bold text-gray-900 hover:text-gray-900 no-underline">
          Elevation Design Studio
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-primary no-underline transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <MobileMenu />
      </nav>
    </header>
  );
}

function MobileMenu() {
  return (
    <>
      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
      <label
        htmlFor="mobile-menu-toggle"
        className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
        aria-label="Toggle menu"
      >
        <span className="w-6 h-0.5 bg-gray-900 transition-transform peer-checked:rotate-45 peer-checked:translate-y-2" />
        <span className="w-6 h-0.5 bg-gray-900 transition-opacity peer-checked:opacity-0" />
        <span className="w-6 h-0.5 bg-gray-900 transition-transform peer-checked:-rotate-45 peer-checked:-translate-y-2" />
      </label>

      {/* Mobile overlay */}
      <div className="fixed inset-0 top-20 bg-white z-40 hidden peer-checked:flex flex-col p-8 md:hidden">
        <ul className="flex flex-col gap-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-lg font-medium text-gray-900 hover:text-primary no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
