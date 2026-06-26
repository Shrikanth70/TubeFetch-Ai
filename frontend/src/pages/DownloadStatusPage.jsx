import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DownloadProgress } from '@/features/download/components/DownloadProgress';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { getDownloadProgress, MOCK_JOB } from '@/features/download/services/downloadService';
import toast from 'react-hot-toast';

const POLL_INTERVAL_MS = 1000;

export function DownloadStatusPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(MOCK_JOB);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!jobId) {
      navigate('/');
      return;
    }

    // Use mock job in Phase 1, animate progress upward
    if (jobId === 'mock-job-001') {
      let progress = 60;
      intervalRef.current = setInterval(() => {
        progress = Math.min(100, progress + 0.4);
        setJob((prev) => ({
          ...prev,
          progressPercent: progress,
          status: progress >= 100 ? 'completed' : 'downloading',
          etaSecs: Math.max(0, Math.round((100 - progress) / 0.4 * (POLL_INTERVAL_MS / 1000))),
          etaLabel: progress >= 100 ? '0s' : `${Math.round((100 - progress) * 2.5)}s`,
        }));
        if (progress >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          toast.success('Download complete!');
        }
      }, POLL_INTERVAL_MS);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }

    // Real backend polling
    const poll = async () => {
      try {
        const updatedJob = await getDownloadProgress(jobId);
        setJob(updatedJob);
        if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (updatedJob.status === 'completed') toast.success('Download complete!');
          else toast.error(updatedJob.errorMessage ?? 'Download failed.');
        }
      } catch (err) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.error('Lost connection to download job.');
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [jobId, navigate]);

  const handleCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    toast('Download cancelled.', { icon: '⚠️' });
    navigate('/');
  };

  const handlePause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setJob((prev) => ({ ...prev, status: 'paused' }));
  };

  const handleResume = () => {
    setJob((prev) => ({ ...prev, status: 'downloading' }));
    // Re-attach polling or simulate resume
  };

  const handleDownloadFile = () => {
    if (job.downloadUrl) {
      const a = document.createElement('a');
      a.href = job.downloadUrl;
      a.download = job.fileName;
      a.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-32 px-gutter relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-48 h-48 bg-tertiary/5 rounded-full blur-3xl" />
        </div>
        <DownloadProgress
          job={job}
          onPause={handlePause}
          onResume={handleResume}
          onCancel={handleCancel}
          onDownloadFile={handleDownloadFile}
        />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
