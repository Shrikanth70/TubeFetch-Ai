import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UrlInputBar } from '@/features/download/components/UrlInputBar';
import { Footer } from '@/components/layout/Footer';
import { useDownloadStore } from '@/features/download/hooks/useDownloadStore';

export function HomePage() {
  const navigate = useNavigate();
  const { setUrl } = useDownloadStore();
  const [isFetching, setIsFetching] = useState(false);

  const handleFetch = async (url) => {
    setIsFetching(true);
    setUrl(url);
    navigate(`/preview?url=${encodeURIComponent(url)}`);
    setIsFetching(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow pt-16 flex flex-col justify-center">
        {/* ── Hero Section ───────────────────────────────────── */}
        <section
          className="relative w-full flex flex-col items-center justify-center px-4 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Ambient gradient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl w-full text-center space-y-lg relative z-10 py-12">
            {/* Badge chip */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm mb-md"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">bolt</span>
              AI-POWERED PRECISION
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tight text-on-background"
            >
              Universal Video <span className="text-primary">Extraction</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto"
            >
              Download content from any platform in high-fidelity 4K. High-speed, secure, and
              formatted exactly how you need it.
            </motion.p>

            {/* URL Input */}
            <div className="mt-xl">
              <UrlInputBar onFetch={handleFetch} isLoading={isFetching} />
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-lg mt-xl font-label-sm text-label-sm"
            >
              {['NO ADS', '4K SUPPORT', 'MP4/MP3/WAV'].map((badge) => (
                <div key={badge} className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">verified</span>
                  {badge}
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
