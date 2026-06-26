import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import video, download

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video.router, prefix=settings.API_V1_STR)
app.include_router(download.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing TubeFetch AI Backend...")
    settings.DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    logger.info(f"Downloads directory verified at: {settings.DOWNLOAD_DIR}")

@app.get("/")
async def root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
