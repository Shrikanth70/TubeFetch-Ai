import { NavLink } from 'react-router-dom';

const MOBILE_NAV = [
  { to: '/', icon: 'search', label: 'Search', end: true },
  { to: '/downloads', icon: 'download', label: 'Downloads', end: false },
  { to: '/history', icon: 'history', label: 'History', end: false },
  { to: '/settings', icon: 'settings', label: 'Settings', end: false },
];

/**
 * Mobile-only bottom tab navigation bar — md:hidden.
 * Matches the Stitch Video Preview & Download Status screens.
 */
export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-3 px-4 pb-safe bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl border-t border-outline-variant/20 shadow-lg z-50 rounded-t-xl"
    >
      {MOBILE_NAV.map(({ to, icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) =>
            [
              'flex flex-col items-center justify-center gap-0.5 min-w-[48px]',
              'font-label-sm text-label-sm active:scale-95 transition-all duration-200',
              isActive ? 'text-primary font-bold' : 'text-secondary',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                aria-hidden="true"
              >
                {icon}
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
