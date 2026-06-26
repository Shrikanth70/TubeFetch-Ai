import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UrlInputBar } from '@/features/download/components/UrlInputBar';
import { Footer } from '@/components/layout/Footer';
import { useDownloadStore } from '@/features/download/hooks/useDownloadStore';

const BENTO_FEATURES = [
  {
    title: 'Fast Downloads',
    description:
      'Our distributed AI nodes process your requests in parallel, delivering speeds up to 10x faster than standard converters.',
    icon: 'speed',
    color: 'primary',
    colSpan: 'md:col-span-8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPdR-W_USeiJ8GxVNknHNsoXkCLcRPDJkLKICRQtgqA5ewsP1_OgYl7wZrzq1jvlpBLW7CVItdGHbxv9TN1QpEwtIlI_cJzdmSLMQ1G7VY3HjuCviUtilkBcj6mhxQNSk28iOUe0xeaPVUk3nHwcFPTOlFzNDje1wLl1U5hrSnZXKVtNfZWxFxgAG-L7Mq3BZJfvOnupjM2iBsbMvuompjpaOGEpM-n33etJk2qNW_rgNhGnH8xH6HCrfm0hrlXQ7d1uDbNRDzvxU',
    imageAlt: 'High-speed data transfer visualization',
    direction: 'row',
  },
  {
    title: 'High Quality',
    description: 'Native resolution support up to 8K. No compression artifacts, just pure visual fidelity.',
    icon: 'high_quality',
    color: 'tertiary',
    colSpan: 'md:col-span-4',
    badge: 'LOSSLESS AUDIO',
    direction: 'col',
  },
  {
    title: 'Multiple Formats',
    description: 'Convert to MP4, MKV, MP3, WAV, and more with one click. AI-driven format optimization included.',
    icon: 'token',
    color: 'secondary',
    colSpan: 'md:col-span-4',
    formats: ['MP4', 'AVI', 'FLAC', 'MOV'],
    direction: 'col',
  },
  {
    title: 'Secure & Private',
    description:
      'We never store your personal data. All processing is done in ephemeral sandboxed environments for maximum security.',
    icon: 'security',
    color: 'primary',
    colSpan: 'md:col-span-8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe4ZOuuYV2QhQy2eYQypw0e7f8m-IfPgY0oSnnUSwGWzjQ6sPKjXuPyFxoDaElIekyMp4SvY3b5y7tJQcoRX-A5ab4e3FTjZ97NThPOKKtdIdGLfColRYLfEri26q3yhOs4vydZM8PgzMg65jZH6kTinHQL120BExpLUPeaHPvCz9JMl1BQArvCRUpDSqxBlgzzFs0qxbKUK47JAmp-A6jvae4MqB65Tt3FBN51ahRkO_FGwM4PpGUbNErRLWC0CE4GnieF9dwGvw',
    imageAlt: 'Digital security visualization',
    direction: 'row-reverse',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is it free to use?',
    a: 'Yes, TubeFetch AI offers a robust free tier with unlimited standard downloads. For 8K resolution and batch processing, we offer a premium subscription.',
  },
  {
    q: 'Which websites are supported?',
    a: 'We support over 50+ major platforms including YouTube, Vimeo, TikTok, Instagram, Twitter (X), and LinkedIn.',
  },
  {
    q: 'How fast are the downloads?',
    a: 'Typical 1080p videos are processed in under 5 seconds. Larger 4K files may take up to 20 seconds depending on the source platform\'s bandwidth.',
  },
];

function FaqItem({ q, a, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden border border-outline-variant/10"
    >
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-full px-lg py-md flex justify-between items-center text-left hover:bg-white/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-label-md text-label-md text-on-surface font-bold">{q}</span>
        <motion.span
          className="material-symbols-outlined text-on-surface-variant shrink-0 ml-4"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          expand_more
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden px-lg bg-white/30"
      >
        <p className="py-md font-body-md text-body-md text-secondary">{a}</p>
      </motion.div>
    </motion.div>
  );
}

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
      <main className="flex-grow pt-16">
        {/* ── Hero Section ───────────────────────────────────── */}
        <section
          className="relative min-h-[870px] flex flex-col items-center justify-center px-4 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Ambient gradient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl w-full text-center space-y-lg relative z-10">
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

        {/* ── Feature Bento Grid ────────────────────────────── */}
        <section className="py-xxl px-8 max-w-container-max mx-auto" aria-labelledby="features-heading">
          <div className="text-center mb-xl">
            <h2 id="features-heading" className="font-headline-xl text-headline-xl text-on-background mb-sm">
              Engineered for Performance
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {BENTO_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={[
                  feature.colSpan,
                  'glass-card p-xl rounded-xl group hover:shadow-xl transition-all border border-outline-variant/10',
                  feature.direction === 'row' || feature.direction === 'row-reverse'
                    ? `flex flex-col md:flex-${feature.direction} gap-xl items-center`
                    : 'flex flex-col justify-between',
                ].join(' ')}
              >
                <div className={`space-y-md text-left ${feature.image ? 'md:w-1/2' : ''}`}>
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center text-${feature.color}`}>
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={feature.icon === 'security' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg">{feature.title}</h3>
                  <p className="font-body-md text-body-md text-secondary">{feature.description}</p>
                  {feature.formats && (
                    <div className="flex flex-wrap gap-2 pt-md">
                      {feature.formats.map((f) => (
                        <span key={f} className="px-3 py-1 rounded bg-surface-container font-label-sm text-label-sm">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {feature.badge && (
                    <div className="mt-lg pt-lg border-t border-outline-variant/10 flex items-center gap-md">
                      <span className="font-label-md text-label-md text-primary font-bold">{feature.badge}</span>
                      <span className="material-symbols-outlined text-primary" aria-hidden="true">check_circle</span>
                    </div>
                  )}
                </div>
                {feature.image && (
                  <div className="md:w-1/2 w-full aspect-video rounded-lg overflow-hidden bg-surface-container-highest">
                    <img
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ Section ───────────────────────────────────── */}
        <section className="py-xxl px-8 bg-surface-container-low" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-xl">
              <h2 id="faq-heading" className="font-headline-xl text-headline-xl text-on-background mb-sm">
                Common Questions
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Everything you need to know about TubeFetch AI
              </p>
            </div>
            <div className="space-y-md">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ───────────────────────────────────── */}
        <section className="py-xxl px-8" aria-labelledby="cta-heading">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-container-max mx-auto rounded-3xl bg-primary-container p-xl md:p-xxl text-center text-on-primary relative overflow-hidden"
          >
            <div className="relative z-10 space-y-lg">
              <h2 id="cta-heading" className="font-display-lg text-display-lg-mobile md:text-headline-xl font-extrabold">
                Ready to start fetching?
              </h2>
              <p className="font-body-lg text-body-lg opacity-90 max-w-[576px] mx-auto">
                Join 50,000+ creators who use TubeFetch AI for their professional media workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center mt-xl">
                <button
                  onClick={() => document.getElementById('url-input')?.focus()}
                  className="px-xl h-14 bg-white text-primary font-label-md text-label-md rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  Get Started Now
                </button>
                <button className="px-xl h-14 bg-primary-fixed/20 backdrop-blur-sm border border-white/30 text-white font-label-md text-label-md rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  View Documentation
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
