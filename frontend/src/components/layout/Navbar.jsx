import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { to: '/', label: 'Search' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-dark-surface-container/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
        <nav
          className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-container-max mx-auto"
          aria-label="Main navigation"
        >
          <Link to="/" className="flex items-center gap-xs focus-visible:outline-none" aria-label="TubeFetch AI home">
            <span className="material-symbols-outlined text-primary text-[32px]" aria-hidden="true">
              smart_display
            </span>
            <span className="font-headline-lg text-headline-lg font-extrabold text-primary tracking-tight">
              TubeFetch AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-xl">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'font-label-md text-label-md hover:opacity-80 transition-opacity',
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant dark:text-dark-on-surface-variant',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="md:hidden flex items-center gap-sm">
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              className="material-symbols-outlined text-on-surface"
            >
              {isMobileMenuOpen ? 'close' : 'menu'}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-outline-variant/10 bg-surface/95 dark:bg-dark-surface/95 backdrop-blur-xl"
            >
              <div className="flex flex-col px-4 py-md gap-sm">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'font-label-md text-label-md py-sm px-md rounded-lg transition-colors',
                        isActive
                          ? 'text-primary bg-primary/5 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container',
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
