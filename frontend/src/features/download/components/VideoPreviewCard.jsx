import { motion } from 'framer-motion';

/**
 * Video thumbnail preview with play overlay — left column of Video Preview page.
 * Matches Stitch design: aspect-video, glass surface, duration badge,
 * channel/views/date metadata row.
 */
export function VideoPreviewCard({ metadata, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-md text-left ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden glass-surface shadow-soft group">
        <img
          src={metadata.thumbnailUrl}
          alt={metadata.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Hover overlay + play button */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div
            className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 active:scale-90 transition-transform cursor-pointer"
            role="img"
            aria-label="Video thumbnail preview"
          >
            <span
              className="material-symbols-outlined text-white text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              play_arrow
            </span>
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-label-sm font-label-sm">
          {metadata.durationLabel}
        </div>
      </div>

      {/* Metadata */}
      <div className="px-2">
        <h2 className="font-headline-xl text-headline-xl text-on-surface dark:text-dark-on-surface tracking-tight line-clamp-2">
          {metadata.title}
        </h2>
        <div className="flex flex-wrap items-center gap-md mt-sm text-on-surface-variant">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
            <span className="font-label-md text-label-md">{metadata.channel}</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">visibility</span>
            <span className="font-label-md text-label-md">{metadata.viewCountLabel}</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">calendar_today</span>
            <span className="font-label-md text-label-md">{metadata.uploadDateLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
