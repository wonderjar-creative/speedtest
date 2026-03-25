"use client";

import { useState } from "react";
import { PAGES } from "@/config/constants";

interface HeaderProps {
  activePage: string;
  onNavigate: (path: string) => void;
  onRace: () => void;
  raceDisabled: boolean;
}

export default function Header({
  activePage,
  onNavigate,
  onRace,
  raceDisabled,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-surface-alt">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Wordmark */}
        <span className="text-teal font-semibold text-lg whitespace-nowrap">
          Denver Headless
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {PAGES.map((page) => (
            <button
              key={page.path}
              onClick={() => onNavigate(page.path)}
              className={`relative px-3 py-1.5 text-sm rounded transition-colors ${
                activePage === page.path
                  ? "text-teal"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {page.name}
              {page.starred && (
                <span className="ml-1 text-yellow-400 text-xs">★</span>
              )}
              {activePage === page.path && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Race button */}
          <button
            onClick={onRace}
            disabled={raceDisabled}
            className="bg-teal text-background font-bold text-sm px-4 py-1.5 rounded transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-dark"
          >
            Race!
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground/70 p-1"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-surface-alt bg-background/95 backdrop-blur">
          {PAGES.map((page) => (
            <button
              key={page.path}
              onClick={() => {
                onNavigate(page.path);
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 text-sm border-b border-surface-alt/50 ${
                activePage === page.path
                  ? "text-teal bg-surface/50"
                  : "text-foreground/70"
              }`}
            >
              {page.name}
              {page.starred && (
                <span className="ml-1 text-yellow-400 text-xs">★</span>
              )}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
