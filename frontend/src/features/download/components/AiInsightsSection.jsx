import { motion } from 'framer-motion';

const INSIGHT_CARDS = [
  {
    icon: 'summarize',
    color: 'bg-tertiary-container',
    textColor: 'text-on-tertiary-container',
    title: 'Text Summary',
    description: 'Get a 500-word executive summary of the key points discussed.',
    action: 'Download PDF',
  },
  {
    icon: 'cut',
    color: 'bg-primary-container',
    textColor: 'text-on-primary-container',
    title: 'Smart Highlights',
    description: 'The AI has identified 4 key segments. Download them as individual clips.',
    action: 'Select Clips',
  },
  {
    icon: 'translate',
    color: 'bg-secondary-container',
    textColor: 'text-on-secondary-container',
    title: 'Auto-Translate',
    description: 'Captions available in 14 languages with 99.2% accuracy rating.',
    action: 'Get SRT',
  },
];

/**
 * AI Insights section below the main video preview — from Stitch Video Preview design.
 */
export function AiInsightsSection() {
  return (
    <section className="mt-xxl" aria-labelledby="ai-insights-heading">
      <div className="flex flex-col md:flex-row items-end justify-between mb-lg gap-md">
        <div className="max-w-2xl text-left">
          <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-label-sm font-label-sm mb-sm inline-block">
            AI FEATURE
          </span>
          <h3 id="ai-insights-heading" className="font-headline-xl text-headline-xl text-on-surface">
            Video Intelligence
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We've pre-analyzed this video for you. Download segments or summaries directly.
          </p>
        </div>
        <button className="text-primary font-label-md text-label-md flex items-center gap-xs hover:underline whitespace-nowrap">
          View full analysis{' '}
          <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {INSIGHT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <div className="glass-surface p-lg rounded-2xl shadow-soft h-full flex flex-col text-left">
              <div
                className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center ${card.textColor} mb-lg`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">{card.icon}</span>
              </div>
              <h5 className="font-headline-lg text-headline-lg mb-sm">{card.title}</h5>
              <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">
                {card.description}
              </p>
              <button className="px-md py-2 border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-variant/50 transition-colors self-start">
                {card.action}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
