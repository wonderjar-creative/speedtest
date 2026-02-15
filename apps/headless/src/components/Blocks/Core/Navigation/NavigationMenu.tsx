'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavigationLink {
  id?: string;
  label: string;
  url: string;
  path?: string;
  target?: string;
  cssClasses?: string[];
  children?: NavigationLink[];
}

interface NavigationMenuProps {
  links: NavigationLink[];
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

interface SubmenuProps {
  items: NavigationLink[];
  depth?: number;
}

const Submenu: React.FC<SubmenuProps> = ({ items, depth = 0 }) => {
  return (
    <ul className={`wp-block-navigation__submenu hidden group-hover:block ${depth === 0 ? 'md:absolute md:left-0 md:bg-soft-cream md:shadow-lg md:rounded-lg md:py-1 md:min-w-48' : 'md:ml-4'}`}>
      {items.map((item, index) => (
        <li
          key={item.id || index}
          className={`wp-block-navigation-item ${item.children ? 'wp-block-navigation-item--has-submenu relative group' : ''} ${item.cssClasses?.join(' ') || ''}`}
        >
          <Link
            href={item.path || item.url}
            target={item.target || '_self'}
            className="wp-block-navigation-item__content block px-4 py-2"
          >
            {item.label}
            {item.children && (
              <svg className="ml-2 inline-block" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke="currentColor" strokeWidth="1.5"></path></svg>
            )}
          </Link>
          {item.children && item.children.length > 0 && (
            <Submenu items={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default function NavigationMenu({ links, title, className, style }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const renderMobileLink = (link: NavigationLink, index: number) => (
    <li key={link.id || index} className="py-2">
      <div className="flex items-center justify-between">
        <Link
          href={link.url}
          target={link.target}
          className="flex-1"
          onClick={() => !link.children && setIsOpen(false)}
        >
          {link.label}
        </Link>
        {link.children && link.children.length > 0 && (
          <button
            onClick={() => setOpenMobileSubmenu(
              openMobileSubmenu === (link.id || index.toString())
                ? null
                : (link.id || index.toString())
            )}
            className="ml-2 p-2"
            aria-label="Toggle submenu"
          >
            <svg className={`inline-block transition-transform ${openMobileSubmenu === (link.id || index.toString()) ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke="currentColor" strokeWidth="1.5"></path></svg>
          </button>
        )}
      </div>
      {link.children && link.children.length > 0 && openMobileSubmenu === (link.id || index.toString()) && (
        <ul className="pl-4 mt-2">
          {link.children.map((child, childIndex) => renderMobileLink(child, childIndex))}
        </ul>
      )}
    </li>
  );

  return (
    <nav className={`${className || ''}`} style={style} aria-label={title}>
      <button
        onClick={toggleMenu}
        className="md:hidden p-2"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-soft-cream shadow-md md:hidden overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-deep-black"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="border-b border-gray-200 py-4">
            <ul className="flex flex-col p-4">
              {links.map((link, index) => renderMobileLink(link, index))}
            </ul>
          </div>
        </div>
      )}

      <ul className="hidden md:flex md:items-center md:space-x-4">
        {links.map((link, index) => (
          <li
            key={link.id || index}
            className={`wp-block-navigation-item group ${link.children ? 'wp-block-navigation-item--has-submenu relative' : ''} ${link.cssClasses?.join(' ') || ''}`}
          >
            <Link
              href={link.path || link.url}
              target={link.target || '_self'}
              className="wp-block-navigation-item__content inline-flex items-center px-1 py-1"
            >
              {link.label}
              {link.children && link.children.length > 0 && (
                <svg className="ml-1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke="currentColor" strokeWidth="1.5"></path></svg>
              )}
            </Link>
            {link.children && link.children.length > 0 && (
              <Submenu items={link.children} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
