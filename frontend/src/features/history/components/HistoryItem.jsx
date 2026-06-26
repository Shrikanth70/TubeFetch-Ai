import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function HistoryItem({ item, index, onDelete, onRedownload }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const mediaIcon =
    item.mediaType === 'audio' ? 'graphic_eq'
    : item.mediaType === 'playlist' ? 'queue_music'
    : 'play_circle';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard className="p-4 flex flex-col md:flex-row items-center gap-6 group text-left" hover>
          {/* Thumbnail */}
          <div className="relative w-full md:w-56 h-32 rounded-xl bg-surface-container flex-shrink-0">
            {item.mediaType === 'playlist' ? (
              // Stacked playlist thumbnail effect
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-xl translate-x-2 -translate-y-2 opacity-40 border border-white/20"
                  style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-xl translate-x-1 -translate-y-1 opacity-70 border border-white/20"
                  style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                />
              </>
            ) : null}
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 border border-white/20 rounded-xl"
              style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
              role="img"
              aria-label={`Thumbnail for ${item.videoTitle}`}
            />
            {/* Duration badge */}
            <div className={[
              "absolute bottom-2 right-2 text-white text-[10px] px-2 py-0.5 rounded font-bold",
              item.mediaType === 'playlist' ? "bg-primary uppercase" : "bg-black/70"
            ].join(' ')}>
              {item.mediaType === 'playlist' ? `Playlist (${item.playlistCount ?? '?'})` : item.durationLabel}
            </div>
            {/* Hover play overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="material-symbols-outlined text-white text-4xl" aria-hidden="true">
                {mediaIcon}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow space-y-1 w-full min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-headline-lg text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                {item.videoTitle}
              </h3>
              <button
                aria-label="More options"
                className="material-symbols-outlined text-on-surface-variant hover:text-primary shrink-0 transition-colors"
              >
                more_vert
              </button>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">person</span>
              {item.channelName}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  {item.mediaType === 'audio' ? 'music_note' : item.mediaType === 'playlist' ? 'folder_zip' : 'movie'}
                </span>
                {item.format} ({item.quality})
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">database</span>
                {item.fileSizeLabel}
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
                {item.createdAtLabel}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => onRedownload(item)}
              className="flex-1 md:w-32 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              aria-label={`Re-download ${item.videoTitle}`}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">download</span>
              Redownload
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 md:w-32 border border-outline-variant/50 text-error py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-error/5 active:scale-95 transition-all"
              aria-label={`Delete ${item.videoTitle} from history`}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">delete</span>
              Delete
            </button>
          </div>
        </GlassCard>
      </motion.div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete from history?"
        description={`"${item.videoTitle}" will be permanently removed from your download history.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
