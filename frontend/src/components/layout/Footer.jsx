import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Product: [
    { label: 'Search', to: '/' },
    { label: 'Downloads', to: '/downloads' },
    { label: 'API', to: '/api' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Documentation', to: '/docs' },
  ],
  Social: [
    { label: 'GitHub', to: 'https://github.com', external: true },
    { label: 'Twitter', to: 'https://twitter.com', external: true },
    { label: 'Discord', to: 'https://discord.com', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest dark:bg-dark-surface border-t border-outline-variant/10 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-8 py-xxl w-full max-w-container-max mx-auto gap-xl">
        {/* Brand */}
        <div className="flex flex-col gap-sm items-center md:items-start">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">
              smart_display
            </span>
            <span className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tighter">
              TubeFetch AI
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px] text-center md:text-left opacity-70">
            Professional grade video extraction utility powered by next-gen AI systems.
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-lg">
            © {new Date().getFullYear()} TubeFetch AI. High-utility precision.
          </p>
        </div>

        {/* Link columns */}
        <div className="flex flex-col md:flex-row gap-xxl">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-md">
              <span className="font-label-md text-label-md text-on-surface font-bold">{section}</span>
              {links.map(({ label, to, external }) =>
                external ? (
                  <a
                    key={label}
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={label}
                    to={to}
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
