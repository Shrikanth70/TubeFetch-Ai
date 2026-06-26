from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from app.services.downloader import DownloaderService

router = APIRouter()

class MetadataRequest(BaseModel):
    url: str

class MetadataResponse(BaseModel):
    success: bool
    data: dict = None
    message: str = None

@router.post("/video/metadata", response_model=MetadataResponse)
async def get_video_metadata(request: MetadataRequest):
    """
    POST /api/v1/video/metadata
    Extracts formats and information for a given YouTube URL.
    """
    url = request.url.strip()
    if not url:
        return MetadataResponse(success=False, message="URL cannot be empty.")
    
    try:
        metadata = DownloaderService.extract_metadata(url)
        return MetadataResponse(
            success=True,
            data=metadata,
            message="Video metadata retrieved successfully."
        )
    except Exception as e:
        return MetadataResponse(
            success=False,
            message=f"Failed to extract video information: {str(e)}"
        )
