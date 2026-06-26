import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HistoryItem as HistoryItemComponent } from '@/features/history/components/HistoryItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonHistoryItem } from '@/components/ui/SkeletonLoader';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useDebounce } from '@/hooks/useDebounce';
import { formatBytes } from '@/utils/formatBytes';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'playlist', label: 'Playlists' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'size_desc', label: 'File Size (Large)' },
  { value: 'duration_desc', label: 'Duration (Long)' },
];

// Mock data for Phase 1
const MOCK_HISTORY = [
  {
    id: '1',
    videoTitle: 'Synthesizing the Future: AI and Robotics in 2024',
    videoUrl: 'https://youtube.com/watch?v=1',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD71bCSpyUJm9RVRoHGn5ct5Co_b1q80xDH1lInHIBbsuZVPZfKb6RLSCDOWfbrjLM7HS0zNk5eWb-pGRzMo3_8LawLZjwHWcRKhsRo8u-xbfmR4skWMJ9uSO1YPMvoqQvWev-EpfEP3XVF5fMlfe5rO6jFrozA5j4wNBTS8UREt33eD-Hfu8jy-uAa58QP7w7KU-FS-57jFA4fmeDX7bO8QJRK5MJgB1cKXEK1aftskm_mo0NDJaBsdFJwjHhEACPZyv1Q_VOsYZU',
    channelName: 'TechHorizon AI',
    durationSecs: 862,
    durationLabel: '14:22',
    format: '4K MP4 (H.264)',
    quality: '4K',
    fileSizeBytes: 883001344,
    fileSizeLabel: '842.5 MB',
    downloadStatus: 'completed',
    mediaType: 'video',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    createdAtLabel: '2 hours ago',
  },
  {
    id: '2',
    videoTitle: 'Midnight Lo-Fi Beats - Study Session #42',
    videoUrl: 'https://youtube.com/watch?v=2',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlFbV-XyL7K-n0ALoQSXVShbMZIYFo9SO7oo5xtxdVPaxjUV7EGDgaNa0xLrFkt99A4X3t4yiN9lbuhdCWwkuW6k0qg54iilDXkqj4etOT05X88qxVOXxBLaNIL1F2_ek0JXIDArEqmKwR2URlG1MyFyPEMCCDCFerYShaNeXZ6gENVfOcmOcbCFom4eKXkZMGeMKvi-JRw20tWgG5YO_rM0SKWUgY-5pUBSqWVUfj4SqHVj0eslPxZO6w9nz7mf4CiavmseaoJZg',
    channelName: 'ChillVibes Records',
    durationSecs: 225,
    durationLabel: '03:45',
    format: '320kbps MP3',
    quality: '320kbps',
    fileSizeBytes: 8599552,
    fileSizeLabel: '8.2 MB',
    downloadStatus: 'completed',
    mediaType: 'audio',
    createdAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
    createdAtLabel: 'Yesterday, 11:15 PM',
  },
  {
    id: '3',
    videoTitle: 'Best of Classical: Masterpieces Vol. 1',
    videoUrl: 'https://youtube.com/playlist?list=1',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVHGGfVwGkE1ikhlPdC2U_W65Z4azyTXHSNKORurPwnUxNIcY59RFfAJfkuFTpKBFE9TnvSIspG8mjI4YROckiMEyvgQ3ctzD9EKQzwt5_QB7S--8b_Q_O9nL8rddNtPxKExl-839jW3BhE7WnoFvejuYvf70qrzArSoc0jkepdC41JdB0tpUV_UG5MFIYKRiXQrV-ZrpZy64q7wDYnUO4gOZEEXMMXpwmu0CgTaDOc5yeO3ck7V7z50pn7y3zIkRCJ6JpN6ySLa0',
    channelName: 'London Symphony Orch.',
    durationSecs: 3600,
    durationLabel: '1:00:00',
    format: 'FLAC Archive',
    quality: '320kbps',
    fileSizeBytes: 2576980377,
    fileSizeLabel: '2.4 GB',
    downloadStatus: 'completed',
    mediaType: 'playlist',
    playlistCount: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    createdAtLabel: '3 days ago',
  },
];

function Pagination({ page, totalPages, onPage }) {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);
  return (
    <div className="mt-12 flex justify-center items-center gap-4" aria-label="Pagination">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
        className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-current={page === p ? 'page' : undefined}
            className={[
              'w-10 h-10 rounded-full font-bold transition-colors cursor-pointer',
              page === p
                ? 'bg-primary text-on-primary'
                : 'text-on-surface hover:bg-surface-container',
            ].join(' ')}
          >
            {p}
          </button>
        ))}
        {totalPages > 3 && (
          <>
            <span className="text-on-surface-variant px-2">...</span>
            <button
              onClick={() => onPage(totalPages)}
              className="w-10 h-10 rounded-full text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>
  );
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(MOCK_HISTORY);
  const [isLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filtered = useMemo(() => {
    let result = [...items];
    if (filter !== 'all') result = result.filter((i) => i.mediaType === filter);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.videoTitle.toLowerCase().includes(q) ||
          i.channelName.toLowerCase().includes(q) ||
          i.videoUrl.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'size_desc') return b.fileSizeBytes - a.fileSizeBytes;
      if (sort === 'duration_desc') return b.durationSecs - a.durationSecs;
      return 0;
    });
    return result;
  }, [items, filter, sort, debouncedSearch]);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleRedownload = (item) => {
    navigate(`/preview?url=${encodeURIComponent(item.videoUrl)}`);
  };

  const totalUsed = items.reduce((acc, i) => acc + i.fileSizeBytes, 0);
  const storageLabel = `${formatBytes(totalUsed)} used of 50 GB`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-container-max mx-auto w-full flex-grow text-left">
        {/* Page Header */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface">Download History</h1>
              <p className="font-body-md text-on-surface-variant mt-1">
                Manage and access your previous media extractions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-label-md text-secondary bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30 self-start md:self-auto">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">storage</span>
              <span>{storageLabel}</span>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden transition-all focus-within:border-tertiary-container focus-within:shadow-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" aria-hidden="true">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search history by title, URL or channel..."
                className="w-full bg-transparent border-none focus:ring-0 py-4 pl-12 pr-4 font-body-md text-on-surface outline-none"
                aria-label="Search history"
              />
            </div>
            <div className="md:col-span-4 flex items-center bg-surface-container rounded-xl border border-outline-variant/30 px-3">
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full bg-transparent border-none focus:ring-0 font-label-md text-on-surface py-3 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter by media type">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setFilter(f.value); setPage(1); }}
                aria-pressed={filter === f.value}
                className={[
                  'px-6 py-2 rounded-full font-label-md transition-all active:scale-95 cursor-pointer',
                  filter === f.value
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-outline-variant/40 mx-1" aria-hidden="true" />
            <button className="text-primary font-label-md flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-full transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Last 30 Days
            </button>
          </div>
        </div>

        {/* History Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => <SkeletonHistoryItem key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon="history"
            title="No history found"
            description={
              debouncedSearch
                ? `No results for "${debouncedSearch}". Try a different search.`
                : 'Start fetching videos to build your download history.'
            }
            actionLabel="Start Fetching"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {paginated.map((item, i) => (
              <HistoryItemComponent
                key={item.id}
                item={item}
                index={i}
                onDelete={handleDelete}
                onRedownload={handleRedownload}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
