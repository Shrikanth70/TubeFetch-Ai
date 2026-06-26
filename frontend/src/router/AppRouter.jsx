import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

// Lazy-loaded pages — code splitting per route
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const VideoPreviewPage = lazy(() => import('@/pages/VideoPreviewPage').then((m) => ({ default: m.VideoPreviewPage })));
const DownloadStatusPage = lazy(() => import('@/pages/DownloadStatusPage').then((m) => ({ default: m.DownloadStatusPage })));
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-md">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin-slow" aria-hidden="true">
          smart_display
        </span>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading...</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preview" element={<VideoPreviewPage />} />
          <Route path="/download-status/:jobId" element={<DownloadStatusPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
