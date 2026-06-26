import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ProfileMenu } from '@/features/auth/components/ProfileMenu';
import { LoginModal } from '@/features/auth/components/LoginModal';

const NAV_LINKS = [
  { to: '/', label: 'Search' },
  { to: '/downloads', label: 'Downloads' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-dark-surface-container/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
        <nav
          className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-container-max mx-auto"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-xs focus-visible:outline-none" aria-label="TubeFetch AI home">
            <span className="material-symbols-outlined text-primary text-[32px]" aria-hidden="true">
              smart_display
            </span>
            <span className="font-headline-lg text-headline-lg font-extrabold text-primary tracking-tight">
              TubeFetch AI
            </span>
          </Link>

          {/* Desktop Nav */}
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary hover:opacity-80 transition-colors"
            >
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </button>

            {/* Auth */}
            {!isLoading && (
              isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen((p) => !p)}
                    aria-label="Open profile menu"
                    className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                  </button>
                  <ProfileMenu isOpen={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)} />
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                  aria-label="Sign in"
                >
                  Sign in
                </button>
              )
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-sm">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="material-symbols-outlined text-on-surface-variant"
            >
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </button>
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

        {/* Mobile Dropdown */}
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
                {!isLoading && !isAuthenticated && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="text-left font-label-md text-label-md text-primary py-sm px-md rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
