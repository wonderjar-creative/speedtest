import Link from "next/link";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-serif font-bold text-white mb-4">
              Elevation Design Studio
            </h3>
            <p className="text-gray-400 mb-2">Architecture & Interior Design</p>
            <p className="text-gray-400">Denver, Colorado</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-gray-300">
              <p>
                <a href="mailto:hello@elevationdesign.co" className="hover:text-white no-underline text-gray-300">
                  hello@elevationdesign.co
                </a>
              </p>
              <p>
                <a href="tel:+13035550123" className="hover:text-white no-underline text-gray-300">
                  (303) 555-0123
                </a>
              </p>
              <p>
                1234 Design District<br />
                Denver, CO 80202
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Elevation Design Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
