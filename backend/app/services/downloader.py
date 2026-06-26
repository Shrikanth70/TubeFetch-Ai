import os
import urllib.parse
import uuid
import logging
import threading
from pathlib import Path
from typing import Dict, Any, List, Optional
import yt_dlp
from app.core.config import settings

logger = logging.getLogger(__name__)

# Thread-safe in-memory job store
JOBS: Dict[str, Dict[str, Any]] = {}
jobs_lock = threading.Lock()

class DownloaderService:
    @staticmethod
    def get_job(job_id: str) -> Optional[Dict[str, Any]]:
        with jobs_lock:
            return JOBS.get(job_id)

    @staticmethod
    def list_jobs() -> List[Dict[str, Any]]:
        with jobs_lock:
            return list(JOBS.values())

    @staticmethod
    def extract_metadata(url: str) -> Dict[str, Any]:
        """
        Extracts video metadata using yt-dlp without downloading.
        """
        # Robust headers to avoid 403 Forbidden errors
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
        }
        
        ydl_opts = {
            'skip_download': True,
            'extract_flat': False,
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'http_headers': headers,
            'referer': 'https://www.youtube.com/',
            'extractor_args': {'youtube': ['client=ANDROID,IOS']},
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
            if not info:
                raise ValueError("Could not extract video information.")

            # Basic metadata
            video_id = info.get('id', '')
            title = info.get('title', 'Unknown Video')
            channel = info.get('uploader') or info.get('channel') or 'Unknown Channel'
            thumbnail = info.get('thumbnail') or (info.get('thumbnails')[0]['url'] if info.get('thumbnails') else '')
            duration = int(info.get('duration') or 0)
            view_count = int(info.get('view_count') or 0)
            
            # Formulate relative/formatted upload date if possible
            upload_date = info.get('upload_date', '') # YYYYMMDD
            if upload_date and len(upload_date) == 8:
                formatted_date = f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:]}T00:00:00Z"
            else:
                formatted_date = ""

            formats = info.get('formats', [])
            
            # Find best audio size for combined size calculation
            best_audio = None
            for f in formats:
                if f.get('vcodec') == 'none' and f.get('acodec') != 'none':
                    if not best_audio or f.get('tbr', 0) > best_audio.get('tbr', 0):
                        best_audio = f
            
            audio_size_fallback = 0
            if best_audio:
                audio_size_fallback = best_audio.get('filesize') or best_audio.get('filesize_approx') or 0

            # Calculate formats
            video_formats = []
            audio_formats = []
            
            # Check maximum available height
            heights = [f.get('height') for f in formats if f.get('height') is not None]
            max_height = max(heights) if heights else 0

            # 1. Populate Video Formats
            # Standard definitions to offer: 4K, 1080p, 720p, 480p, 360p
            video_specs = [
                {"id": "2160p", "label": "4K Ultra HD (MP4)", "quality": "4K", "height": 2160, "icon": "hd", "badge": "BEST", "bitrate": 20_000_000},
                {"id": "1080p", "label": "Full HD (MP4)", "quality": "1080p", "height": 1080, "icon": "high_quality", "bitrate": 4_000_000},
                {"id": "720p", "label": "Standard HD (MP4)", "quality": "720p", "height": 720, "icon": "branding_watermark", "bitrate": 2_000_000},
                {"id": "480p", "label": "Standard (MP4)", "quality": "480p", "height": 480, "icon": "sd", "bitrate": 1_000_000},
                {"id": "360p", "label": "Low Quality (MP4)", "quality": "360p", "height": 360, "icon": "sd", "bitrate": 500_000},
            ]

            for spec in video_specs:
                # Only offer if the video actually supports this height (or is close to it, or for standard sizes < max_height)
                if spec["height"] <= max_height or (spec["height"] == 480 and max_height >= 360) or (spec["height"] == 360):
                    # Estimate file size
                    # Try to find a matching format in yt-dlp to get actual size
                    matching_formats = [f for f in formats if f.get('height') == spec["height"]]
                    video_size = 0
                    if matching_formats:
                        # Sort by filesize or approx
                        matching_formats.sort(key=lambda x: x.get('filesize') or x.get('filesize_approx') or 0, reverse=True)
                        best_match = matching_formats[0]
                        video_size = best_match.get('filesize') or best_match.get('filesize_approx') or 0
                    
                    if not video_size:
                        # Fallback calculation based on duration and typical bitrate
                        video_size = (spec["bitrate"] * duration) // 8
                    
                    total_size = video_size + audio_size_fallback
                    
                    format_obj = {
                        "id": spec["id"],
                        "label": spec["label"],
                        "quality": spec["quality"],
                        "format": "mp4",
                        "fileSizeBytes": total_size if total_size > 0 else 10 * 1024 * 1024, # min 10MB fallback
                        "icon": spec["icon"]
                    }
                    if spec.get("badge"):
                        format_obj["badge"] = spec["badge"]
                    video_formats.append(format_obj)

            # 2. Populate Audio Formats
            audio_specs = [
                {"id": "mp3-320", "label": "MP3 High Quality", "quality": "320kbps", "format": "mp3", "icon": "music_note", "badge": "BEST", "bitrate": 320_000},
                {"id": "mp3-128", "label": "MP3 Standard", "quality": "128kbps", "format": "mp3", "icon": "audio_file", "bitrate": 128_000},
                {"id": "flac", "label": "FLAC Lossless", "quality": "Lossless", "format": "flac", "icon": "high_quality", "bitrate": 800_000},
            ]

            for spec in audio_specs:
                estimated_size = (spec["bitrate"] * duration) // 8
                format_obj = {
                    "id": spec["id"],
                    "label": spec["label"],
                    "quality": spec["quality"],
                    "format": spec["format"],
                    "fileSizeBytes": estimated_size if estimated_size > 0 else 5 * 1024 * 1024, # min 5MB fallback
                    "icon": spec["icon"]
                }
                if spec.get("badge"):
                    format_obj["badge"] = spec["badge"]
                audio_formats.append(format_obj)

            return {
                "id": video_id,
                "title": title,
                "channel": channel,
                "thumbnailUrl": thumbnail,
                "durationSecs": duration,
                "viewCount": view_count,
                "uploadDate": formatted_date,
                "url": url,
                "platform": "YouTube",
                "videoFormats": video_formats,
                "audioFormats": audio_formats
            }
        except Exception as e:
            logger.error(f"Failed to extract metadata for {url}: {e}", exc_info=True)
            raise e

    @classmethod
    def start_download(cls, url: str, format_ext: str, quality: str, media_type: str) -> str:
        """
        Creates a job ID and runs the download in a background thread.
        """
        job_id = f"job-{uuid.uuid4().hex[:8]}"
        
        with jobs_lock:
            JOBS[job_id] = {
                "jobId": job_id,
                "status": "downloading",
                "progressPercent": 0.0,
                "speedBytesPerSec": 0.0,
                "etaSecs": 0,
                "totalBytes": 0,
                "downloadedBytes": 0,
                "fileName": "Preparing download...",
                "downloadUrl": None,
                "errorMessage": None
            }

        # Start thread
        thread = threading.Thread(
            target=cls._download_task,
            args=(job_id, url, format_ext, quality, media_type)
        )
        thread.daemon = True
        thread.start()
        
        return job_id

    @classmethod
    def _download_task(cls, job_id: str, url: str, format_ext: str, quality: str, media_type: str):
        logger.info(f"Starting background download task {job_id} for {url} ({media_type}, {quality})")
        
        # Resolve target heights or audio settings
        # Default options with robust headers to avoid 403 Forbidden errors
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
        }

        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'http_headers': headers,
            'referer': 'https://www.youtube.com/',
            'extractor_args': {'youtube': ['client=ANDROID,IOS']},
        }

        # Build hook to update state
        def progress_hook(d):
            if d['status'] == 'downloading':
                downloaded = d.get('downloaded_bytes', 0)
                total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
                speed = d.get('speed', 0.0) or 0.0
                eta = d.get('eta') or 0
                
                percent = 0.0
                if total > 0:
                    percent = (downloaded / total) * 100
                elif d.get('percent'):
                    percent = d.get('percent')
                else:
                    # If we don't know the total size, fake some progress based on downloaded bytes
                    percent = min(99.0, (downloaded / (10 * 1024 * 1024)) * 100)

                filename = os.path.basename(d.get('filename', ''))
                
                with jobs_lock:
                    if job_id in JOBS:
                        job = JOBS[job_id]
                        job['downloadedBytes'] = downloaded
                        job['totalBytes'] = total
                        job['progressPercent'] = round(percent, 1)
                        job['speedBytesPerSec'] = speed
                        job['etaSecs'] = eta
                        if filename and not job['fileName'].endswith(format_ext):
                            # Set clean title base
                            base, _ = os.path.splitext(filename)
                            job['fileName'] = f"{base}.{format_ext}"
            elif d['status'] == 'finished':
                # Finalizing processing
                with jobs_lock:
                    if job_id in JOBS:
                        JOBS[job_id]['progressPercent'] = 99.0
                        JOBS[job_id]['fileName'] = "Processing media..."

        ydl_opts['progress_hooks'] = [progress_hook]

        # Setup downloader options
        try:
            # Create download dir if not exists
            settings.DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
            
            if media_type == 'video':
                # Map quality (e.g. '1080p', '720p', etc.) to height
                height = 1080
                if '2160' in quality or '4K' in quality:
                    height = 2160
                elif '1080' in quality:
                    height = 1080
                elif '720' in quality:
                    height = 720
                elif '480' in quality:
                    height = 480
                elif '360' in quality:
                    height = 360
                
                ydl_opts.update({
                    'format': f'bestvideo[height<={height}]+bestaudio/best',
                    'outtmpl': str(settings.DOWNLOAD_DIR / '%(title)s.%(ext)s'),
                    'merge_output_format': 'mp4',
                })
            else:
                # Audio extraction
                codec = 'mp3'
                bitrate = '320'
                if format_ext == 'flac':
                    codec = 'flac'
                    bitrate = None
                elif '128' in quality:
                    bitrate = '128'
                
                postprocessor = {
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': codec,
                }
                if bitrate:
                    postprocessor['preferredquality'] = bitrate

                ydl_opts.update({
                    'format': 'bestaudio/best',
                    'outtmpl': str(settings.DOWNLOAD_DIR / '%(title)s.%(ext)s'),
                    'postprocessors': [postprocessor],
                })

            # Extract info to get real final name
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(url, download=True)
                expected_filename = ydl.prepare_filename(info_dict)
                
            # Compute final path (extension may change due to merging or audio extraction)
            base_path, _ = os.path.splitext(expected_filename)
            final_path = base_path + f".{format_ext}"
            
            # Wait, let's verify if the file exists, if not search for it in download directory
            if not os.path.exists(final_path):
                # Search for file matching base title in DOWNLOAD_DIR
                title = info_dict.get('title')
                if title:
                    # sanitize title as yt-dlp does
                    sanitized_title = yt_dlp.utils.sanitize_filename(title)
                    for f in os.listdir(settings.DOWNLOAD_DIR):
                        if sanitized_title in f and f.endswith(format_ext):
                            final_path = str(settings.DOWNLOAD_DIR / f)
                            break

            # Confirm file exists
            if not os.path.exists(final_path):
                raise FileNotFoundError(f"Could not find download file at expected path: {final_path}")

            file_size = os.path.getsize(final_path)
            file_name = os.path.basename(final_path)
            
            # Success update
            with jobs_lock:
                if job_id in JOBS:
                    job = JOBS[job_id]
                    job['status'] = 'completed'
                    job['progressPercent'] = 100.0
                    job['speedBytesPerSec'] = 0.0
                    job['etaSecs'] = 0
                    job['totalBytes'] = file_size
                    job['downloadedBytes'] = file_size
                    job['fileName'] = file_name
                    # Setup local URL for downloading this file (using relative path so Vite proxy routes it as same-origin)
                    job['downloadUrl'] = f"/api/v1/download/file/{job_id}/{urllib.parse.quote(file_name)}"
                    
            logger.info(f"Job {job_id} completed successfully. Saved to {final_path}")
            
        except Exception as e:
            logger.error(f"Download failed for job {job_id}: {e}", exc_info=True)
            with jobs_lock:
                if job_id in JOBS:
                    job = JOBS[job_id]
                    job['status'] = 'failed'
                    job['errorMessage'] = str(e)
