import { apiClient } from '@/services/api';
import { formatBytes } from '@/utils/formatBytes';
import { formatDuration, formatEta } from '@/utils/formatDuration';
import { formatViewCount, formatRelativeTime } from '@/utils/formatRelativeTime';

// ─── Metadata ───────────────────────────────────────────────────────────────

export async function fetchVideoMetadata(url) {
  const { data } = await apiClient.post('/video/metadata', { url });
  if (!data.success || !data.data) throw new Error(data.message);

  const raw = data.data;

  // Decorate with formatted labels
  return {
    ...raw,
    durationLabel: formatDuration(raw.durationSecs),
    viewCountLabel: formatViewCount(raw.viewCount),
    uploadDateLabel: formatRelativeTime(raw.uploadDate),
    videoFormats: raw.videoFormats.map((f) => ({
      ...f,
      fileSizeLabel: formatBytes(f.fileSizeBytes),
    })),
    audioFormats: raw.audioFormats.map((f) => ({
      ...f,
      fileSizeLabel: formatBytes(f.fileSizeBytes),
    })),
  };
}

// ─── Download ────────────────────────────────────────────────────────────────

export async function startDownload(request) {
  const { data } = await apiClient.post('/download', request);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data.jobId;
}

export async function getDownloadProgress(jobId) {
  const { data } = await apiClient.get(`/download/${jobId}`);
  if (!data.success || !data.data) throw new Error(data.message);

  const raw = data.data;
  return {
    ...raw,
    speedLabel: `${formatBytes(raw.speedBytesPerSec)}/s`,
    etaLabel: formatEta(raw.etaSecs),
    totalBytesLabel: formatBytes(raw.totalBytes),
  };
}

// ─── Mock data for Phase 1 UI (no backend yet) ───────────────────────────────

export const MOCK_METADATA = {
  id: 'dQw4w9WgXcQ',
  title: 'Understanding Generative AI: From LLMs to Diffusion Models',
  channel: 'TechCrunch Elite',
  thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKv2iZ-rap3cug4lZwPXc00IfxNx8-bfAP-4i1HWExKsGb0ADfGAAIdcuHQiR-NOy3w_PhRxlALF7iFKX4r_8lpTsi2rvSzEyFXCO4LYWMPj6NSqqEW2Nz-eusPM8Px5nx8T3t9yNbd58sJWaXvTiwzKmQom8gc73GPrs5KZxmt7HUtq_dmYla90V5OKVLwy1pi7GN3WstzMW842uDDyncHfg8eRWWc8I6BmpF2rQ94tBmCAmiCp1ydhMZhfShnfsZrTI1Jm0o0XY',
  durationSecs: 872,
  durationLabel: '14:32',
  viewCount: 1200000,
  viewCountLabel: '1.2M views',
  uploadDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  uploadDateLabel: '2 days ago',
  url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  platform: 'YouTube',
  videoFormats: [
    { id: '4k', label: '4K Ultra HD (MP4)', quality: '4K', format: 'mp4', fileSizeBytes: 1288490188, fileSizeLabel: '1.2 GB', icon: 'hd', badge: 'BEST' },
    { id: '1080p', label: 'Full HD (MP4)', quality: '1080p', format: 'mp4', fileSizeBytes: 251658240, fileSizeLabel: '240 MB', icon: 'high_quality' },
    { id: '720p', label: 'Standard HD (MP4)', quality: '720p', format: 'mp4', fileSizeBytes: 120586240, fileSizeLabel: '115 MB', icon: 'branding_watermark' },
  ],
  audioFormats: [
    { id: 'mp3-320', label: 'MP3 High Quality', quality: '320kbps', format: 'mp3', fileSizeBytes: 30720000, fileSizeLabel: '29.3 MB', icon: 'music_note', badge: 'BEST' },
    { id: 'mp3-128', label: 'MP3 Standard', quality: '128kbps', format: 'mp3', fileSizeBytes: 12288000, fileSizeLabel: '11.7 MB', icon: 'audio_file' },
    { id: 'flac', label: 'FLAC Lossless', quality: '320kbps', format: 'flac', fileSizeBytes: 92160000, fileSizeLabel: '87.9 MB', icon: 'high_quality' },
  ],
};

export const MOCK_JOB = {
  jobId: 'mock-job-001',
  status: 'downloading',
  progressPercent: 60,
  speedBytesPerSec: 13000000,
  speedLabel: '12.4 MB/s',
  etaSecs: 165,
  etaLabel: '2m 45s',
  totalBytes: 1288490188,
  totalBytesLabel: '1.2 GB',
  downloadedBytes: 773094113,
  fileName: 'Understanding Generative AI - 4K.mp4',
};
