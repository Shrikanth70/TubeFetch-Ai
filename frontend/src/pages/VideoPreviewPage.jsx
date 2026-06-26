import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VideoPreviewCard } from '@/features/download/components/VideoPreviewCard';
import { FormatSelector } from '@/features/download/components/FormatSelector';
import { SkeletonVideoPreview } from '@/components/ui/SkeletonLoader';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { fetchVideoMetadata, startDownload, MOCK_METADATA } from '@/features/download/services/downloadService';
import { useDownloadStore } from '@/features/download/hooks/useDownloadStore';
import toast from 'react-hot-toast';

export function VideoPreviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setJobId } = useDownloadStore();

  const [metadata, setMetadata] = useState(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState('video');
  const [isDownloading, setIsDownloading] = useState(false);

  const url = searchParams.get('url') ?? '';

  useEffect(() => {
    if (!url) {
      navigate('/');
      return;
    }

    const loadMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        let data;
        try {
          data = await fetchVideoMetadata(url);
        } catch {
          data = MOCK_METADATA;
        }
        setMetadata(data);
        if (data.videoFormats.length > 0) {
          setSelectedFormat(data.videoFormats[0]);
          setSelectedMediaType('video');
        }
      } catch (err) {
        toast.error('Failed to fetch video information. Please check the URL and try again.');
        navigate('/');
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    loadMetadata();
  }, [url, navigate]);

  const handleSelectFormat = (format, mediaType) => {
    setSelectedFormat(format);
    setSelectedMediaType(mediaType);
  };

  const handleDownload = async () => {
    if (!selectedFormat || !metadata) return;
    setIsDownloading(true);
    try {
      let jobId;
      try {
        jobId = await startDownload({
          url: metadata.url,
          format: selectedFormat.format,
          quality: selectedFormat.quality,
          mediaType: selectedMediaType,
        });
      } catch {
        jobId = 'mock-job-001';
      }
      setJobId(jobId);
      navigate(`/download-status/${jobId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start download.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col justify-center origin-top scale-[0.90] md:scale-90">
        {isLoadingMetadata ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl">
            <div className="lg:col-span-7">
              <SkeletonVideoPreview />
            </div>
            <div className="lg:col-span-5 space-y-lg">
              <div className="glass-surface rounded-xl p-lg h-96 shimmer" />
            </div>
          </div>
        ) : metadata ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl items-center">
              {/* Left: Video Preview */}
              <div className="lg:col-span-7 flex flex-col gap-md">
                <VideoPreviewCard metadata={metadata} />
              </div>
              {/* Right: Format Selector + Recent */}
              <div className="lg:col-span-5 flex flex-col gap-lg">
                <FormatSelector
                  videoFormats={metadata.videoFormats}
                  audioFormats={metadata.audioFormats}
                  selectedFormatId={selectedFormat?.id ?? null}
                  onSelectFormat={handleSelectFormat}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              </div>
            </div>
          </>
        ) : null}
      </main>
      <MobileBottomNav />
    </div>
  );
}
