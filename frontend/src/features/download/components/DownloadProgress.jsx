import { motion } from 'framer-motion';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

/**
 * Download status panel — faithful to Stitch Download Status screen.
 * Circular ring + Speed/ETA/Size bento + Pause/Cancel actions.
 */
export function DownloadProgress({ job, onPause, onResume, onCancel, onDownloadFile }) {
  const isCompleted = job.status === 'completed';
  const isPaused = job.status === 'paused';
  const isFailed = job.status === 'failed';

  return (
    <motion.div
      className="z-10 w-full max-w-2xl flex flex-col items-center mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Circular Progress */}
      <ProgressRing
        percent={job.progressPercent}
        size={288}
        sublabel={
          isCompleted ? 'Complete'
          : isFailed ? 'Failed'
          : isPaused ? 'Paused'
          : 'Downloading'
        }
        className="mb-12"
      />

      {/* Video Info */}
      <div className="text-center mb-xl">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2 line-clamp-1">
          {job.fileName}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isFailed ? (
            <span className="text-error">{job.errorMessage ?? 'Download failed.'}</span>
          ) : isCompleted ? (
            'Download complete — your file is ready.'
          ) : (
            `Processing in progress...`
          )}
        </p>
      </div>

      {/* Metrics Bento */}
      {!isFailed && (
        <GlassCard className="p-lg w-full grid grid-cols-1 md:grid-cols-3 gap-lg shadow-sm mb-xl">
          {[
            { icon: 'speed', label: 'Speed', value: isCompleted ? '—' : job.speedLabel },
            { icon: 'timer', label: 'Time Left', value: isCompleted ? '0s' : job.etaLabel },
            { icon: 'database', label: 'Total Size', value: job.totalBytesLabel },
          ].map(({ icon, label, value }, i) => (
            <div
              key={label}
              className={[
                'flex flex-col items-center justify-center p-md',
                i < 2 ? 'md:border-r border-outline-variant/10' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 mb-2 text-secondary">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{icon}</span>
                <span className="font-label-md text-label-md">{label}</span>
              </div>
              <p className="font-headline-lg text-headline-lg text-on-surface">{value}</p>
            </div>
          ))}
        </GlassCard>
      )}

      {/* Actions */}
      <div className="flex gap-lg">
        {isCompleted && (
          <Button
            variant="primary"
            size="md"
            onClick={onDownloadFile}
            leftIcon={<span className="material-symbols-outlined">download</span>}
          >
            Save to Device
          </Button>
        )}

        {!isCompleted && !isFailed && (
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={isPaused ? onResume : onPause}
              leftIcon={
                <span className="material-symbols-outlined">
                  {isPaused ? 'play_arrow' : 'pause'}
                </span>
              }
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={onCancel}
              leftIcon={<span className="material-symbols-outlined">close</span>}
            >
              Cancel Download
            </Button>
          </>
        )}
        {isFailed && (
          <Button
            variant="primary"
            size="md"
            onClick={onCancel}
            leftIcon={<span className="material-symbols-outlined">arrow_back</span>}
          >
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
}
