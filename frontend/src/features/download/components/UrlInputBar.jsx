import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { validateUrl } from '@/utils/validateUrl';
import toast from 'react-hot-toast';

/**
 * The hero URL input bar — faithful to Stitch Home design.
 * Includes platform validation, focus glow, and animated feedback.
 */
export function UrlInputBar({ onFetch, isLoading = false }) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, error } = validateUrl(url);
    if (!valid) {
      toast.error(error ?? 'Invalid URL');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    onFetch(url.trim());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={[
        'w-full max-w-3xl mx-auto glass-card p-4 rounded-xl shadow-2xl',
        'flex flex-col md:flex-row gap-4',
        'transition-all duration-300',
        isFocused ? 'ring-4 ring-primary/10' : '',
      ].join(' ')}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      role="search"
      aria-label="Video URL input"
    >
      {/* Input */}
      <div className="relative flex-grow">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none"
          aria-hidden="true"
        >
          link
        </span>
        <input
          ref={inputRef}
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste YouTube, Vimeo, or Twitter URL here..."
          aria-label="Video URL"
          autoComplete="off"
          spellCheck={false}
          className={[
            'w-full h-14 pl-12 pr-4',
            'bg-surface-container-low dark:bg-dark-surface-container',
            'border-2 border-transparent focus:border-tertiary-container',
            'rounded-lg font-body-md text-body-md text-on-surface',
            'outline-none transition-all duration-200',
            'placeholder:text-on-surface-variant/50',
          ].join(' ')}
        />
      </div>

      {/* CTA Button */}
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className={[
          'h-14 px-8 bg-primary text-on-primary font-label-md text-label-md rounded-lg',
          'flex items-center justify-center gap-2',
          'hover:scale-[1.02] active:scale-95 transition-all cta-glow shadow-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
        ].join(' ')}
        aria-label="Fetch video content"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin-slow text-[18px]" aria-hidden="true">
              autorenew
            </span>
            <span>Fetching...</span>
          </>
        ) : (
          <>
            <span>Fetch Content</span>
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </>
        )}
      </button>
    </motion.form>
  );
}
