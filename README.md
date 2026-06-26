# TubeFetch AI

TubeFetch AI is a powerful, modern web application for extracting and downloading high-fidelity video and audio from various platforms. It features a responsive React frontend and a fast FastAPI backend powered by yt-dlp.

## Features
- **High Quality**: Supports downloading videos up to 4K resolution and lossless audio formats like FLAC.
- **Fast Processing**: Efficient background downloading and parallel processing.
- **Modern UI**: A sleek, responsive, glassmorphism-inspired design built with Tailwind CSS and Framer Motion.
- **Real-time Status**: Live download progress, speed, and ETA tracking.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend**: FastAPI, yt-dlp, Python

## Getting Started

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn app.main:app --reload`
(Ensure `ffmpeg` is installed on your system for audio extraction and format merging.)

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

The app will be available at `http://localhost:5173`.
