import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.services.downloader import DownloaderService
from app.core.config import settings

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str
    format: str
    quality: str
    mediaType: str

class DownloadResponse(BaseModel):
    success: bool
    data: dict = None
    message: str = None

@router.post("/download", response_model=DownloadResponse)
async def create_download_job(request: DownloadRequest):
    """
    POST /api/v1/download
    Triggers a background download job for the given YouTube URL and format.
    """
    url = request.url.strip()
    if not url:
        return DownloadResponse(success=False, message="URL cannot be empty.")
    
    try:
        # Start download job asynchronously
        job_id = DownloaderService.start_download(
            url=url,
            format_ext=request.format,
            quality=request.quality,
            media_type=request.mediaType
        )
        return DownloadResponse(
            success=True,
            data={"jobId": job_id},
            message="Download started in the background."
        )
    except Exception as e:
        return DownloadResponse(
            success=False,
            message=f"Failed to start download: {str(e)}"
        )

@router.get("/download/{job_id}", response_model=DownloadResponse)
async def get_job_progress(job_id: str):
    """
    GET /api/v1/download/{job_id}
    Retrieves the status and progress of a download job.
    """
    job = DownloaderService.get_job(job_id)
    if not job:
        return DownloadResponse(
            success=False,
            message="Download job not found."
        )
    return DownloadResponse(
        success=True,
        data=job,
        message="Job progress retrieved successfully."
    )

@router.get("/download/file/{job_id}/{filename:path}")
async def get_downloaded_file(job_id: str, filename: str = None):
    """
    GET /api/v1/download/file/{job_id}
    Serves the downloaded file for local storage saving.
    """
    job = DownloaderService.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    
    if job.get("status") != "completed":
        raise HTTPException(status_code=400, detail="Job has not completed yet.")
    
    filename = job.get("fileName")
    file_path = settings.DOWNLOAD_DIR / filename
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Downloaded file not found on disk.")
    
    # Return FileResponse with proper attachment disposition headers so browser initiates download prompt
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
