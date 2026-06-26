import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

/**
 * Format selection panel — right column of Video Preview page.
 * Implements the Video/Audio toggle + quality option rows from Stitch design.
 */
export function FormatSelector({
  videoFormats,
  audioFormats,
  selectedFormatId,
  onSelectFormat,
  onDownload,
  isDownloading = false,
}) {
  const [activeTab, setActiveTab] = useState('video');

  const formats = activeTab === 'video' ? videoFormats : audioFormats;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-surface rounded-xl p-lg shadow-soft text-left"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">Choose Format</h3>
        {/* Tab Toggle */}
        <div className="flex bg-surface-container rounded-lg p-xs" role="tablist" aria-label="Media type">
          {['video', 'audio'].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'px-md py-1.5 rounded-md font-label-md text-label-md capitalize transition-all',
                activeTab === tab
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-on-surface-variant hover:bg-white/50',
              ].join(' ')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Format Options */}
      <div className="space-y-sm" role="radiogroup" aria-label="Quality options">
        {formats.map((format) => {
          const isSelected = format.id === selectedFormatId;
          return (
            <motion.div
              key={format.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectFormat(format, activeTab)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectFormat(format, activeTab)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={[
                'flex items-center justify-between p-md rounded-lg cursor-pointer transition-all',
                isSelected
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border border-outline-variant/30 hover:border-primary/50 bg-white/40',
              ].join(' ')}
            >
              <div className="flex items-center gap-md">
                <div
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary-container text-secondary',
                  ].join(' ')}
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    {format.icon}
                  </span>
                </div>
                <div>
                  <p className={`font-label-md text-label-md text-on-surface ${isSelected ? 'font-bold' : ''}`}>
                    {format.label}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {format.quality} • {format.fileSizeLabel}
                  </p>
                </div>
              </div>
              <span
                className={`material-symbols-outlined ${isSelected ? 'text-primary' : 'text-outline-variant group-hover:text-primary'} transition-colors`}
                style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                aria-hidden="true"
              >
                {isSelected ? 'check_circle' : 'download'}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onDownload}
        isLoading={isDownloading}
        disabled={!selectedFormatId}
        leftIcon={
          <span className="material-symbols-outlined" aria-hidden="true">download_for_offline</span>
        }
        className="mt-lg rounded-xl font-headline-lg text-headline-lg"
      >
        Fetch This Video
      </Button>

      <p className="text-center mt-md font-label-sm text-label-sm text-on-surface-variant italic">
        Processing handled by TubeFetch AI precision engine.
      </p>
    </motion.div>
  );
}
