import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-lg max-w-[448px]"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-5xl" aria-hidden="true">
            search_off
          </span>
        </div>
        <div>
          <h1 className="font-display-lg text-[80px] font-extrabold text-primary leading-none">404</h1>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mt-sm">Page not found</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 h-12 px-xl bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined" aria-hidden="true">home</span>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
