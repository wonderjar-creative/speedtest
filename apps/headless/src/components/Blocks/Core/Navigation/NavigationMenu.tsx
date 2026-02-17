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
    <ul className={`wp-block-navigation__submenu ${depth === 0 ? 'wp-block-navigation__submenu--depth-0' : 'wp-block-navigation__submenu--nested'}`}>
      {items.map((item, index) => (
        <li
          key={item.id || index}
          className={`wp-block-navigation-item ${item.children ? 'wp-block-navigation-item--has-submenu' : ''} ${item.cssClasses?.join(' ') || ''}`}
        >
          <Link
            href={item.path || item.url}
            target={item.target || '_self'}
            className="wp-block-navigation-item__content"
          >
            {item.label}
            {item.children && (
              <svg className="wp-block-navigation-item__submenu-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke="currentColor" strokeWidth="1.5"></path></svg>
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

  const renderMobileLink = (link: NavigationLink, index: number) => {
    const itemId = link.id || index.toString();
    const isSubmenuOpen = openMobileSubmenu === itemId;

    return (
      <li key={itemId} className="wp-block-navigation__mobile-item">
        <div className="wp-block-navigation__mobile-item-row">
          <Link
            href={link.url}
            target={link.target}
            className="wp-block-navigation__mobile-item-link"
            onClick={() => !link.children && setIsOpen(false)}
          >
            {link.label}
          </Link>
          {link.children && link.children.length > 0 && (
            <button
              onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : itemId)}
              className="wp-block-navigation__mobile-submenu-toggle"
              aria-label="Toggle submenu"
            >
              <svg className={isSubmenuOpen ? 'is-open' : ''} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke="currentColor" strokeWidth="1.5"></path></svg>
            </button>
          )}
        </div>
        {link.children && link.children.length > 0 && isSubmenuOpen && (
          <ul className="wp-block-navigation__mobile-submenu">
            {link.children.map((child, childIndex) => renderMobileLink(child, childIndex))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`${className || ''}`} style={style} aria-label={title}>
      <button
        onClick={toggleMenu}
        className="wp-block-navigation__responsive-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="wp-block-navigation__mobile-overlay">
          <button
            className="wp-block-navigation__mobile-close"
            onClick={() => setIsOpen(false)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="wp-block-navigation__mobile-container">
            <ul className="wp-block-navigation__mobile-list">
              {links.map((link, index) => renderMobileLink(link, index))}
            </ul>
          </div>
        </div>
      )}

      <ul className="wp-block-navigation__desktop-list">
        {links.map((link, index) => (
          <li
            key={link.id || index}
            className={`wp-block-navigation-item ${link.children ? 'wp-block-navigation-item--has-submenu' : ''} ${link.cssClasses?.join(' ') || ''}`}
          >
            <Link
              href={link.path || link.url}
              target={link.target || '_self'}
              className="wp-block-navigation-item__content"
            >
              {link.label}
              {link.children && link.children.length > 0 && (
                <svg className="wp-block-navigation-item__submenu-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke="currentColor" strokeWidth="1.5"></path></svg>
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
