# ARCHITECTURE.md

# YouTube Downloader SaaS — Production Architecture

> **Objective**
>
> Build a production-grade, portfolio-quality YouTube Downloader web application with a modern SaaS user experience.
>
> The application must demonstrate frontend engineering, backend engineering, authentication, database design, cloud deployment, scalability, and clean architecture.

---

# Vision

This project is **NOT** a simple downloader.

The objective is to build something that resembles a commercial SaaS application with excellent UI/UX, modular architecture, authentication, persistent history, cloud deployment, and production-ready code quality.

The final product should be something that immediately stands out in a software engineering portfolio.

---

# Product Goals

Users should be able to:

* Login securely
* Paste a YouTube URL
* Preview the video
* Select video/audio quality
* Download media
* Track download progress
* View previous downloads
* Manage account preferences
* Use dark/light mode
* Access the application from desktop and mobile browsers

---

# High-Level Architecture

```text
                 User
                   │
                   ▼
         React Frontend (Vercel)
                   │
          HTTPS REST API
                   │
                   ▼
       FastAPI Backend (Render)
          │                │
          │                │
          ▼                ▼
   Supabase Auth     yt-dlp + FFmpeg
          │
          ▼
     PostgreSQL Database
```

---

# Technology Stack

## Frontend

React

Vite

TypeScript

Tailwind CSS

React Router

TanStack Query

Axios

Framer Motion

React Hook Form

Zod

Lucide Icons

React Hot Toast

Context API

---

## Backend

FastAPI

Python

yt-dlp

FFmpeg

SQLAlchemy

Pydantic

Alembic

JWT Validation

Uvicorn

---

## Authentication

Supabase Authentication

Google OAuth

Email Login

Email Verification

Session Management

Refresh Tokens

---

## Database

Supabase PostgreSQL

---

## Deployment

Frontend

Vercel

Backend

Render

Database

Supabase

Storage

Supabase Storage (optional)

---

# UI Philosophy

The frontend should resemble a premium SaaS dashboard.

Design inspiration:

* Vercel
* Linear
* Stripe
* Notion
* Raycast
* Clerk
* Supabase Dashboard

Never make the application feel like a college project.

---

# Stitch Design Rules

Google Stitch will generate the initial UI.

The generated design is the visual source of truth.

Developers must:

* Preserve layout hierarchy
* Preserve spacing system
* Preserve typography scale
* Preserve animations
* Preserve card structure
* Preserve responsive layouts

Backend integration must never change the design.

Only data should become dynamic.

Never redesign components unless absolutely necessary.

---

# Color System

Primary

YouTube Red

Accent

Blue

Background

Soft White

Dark Mode

Slate

Use consistent spacing.

Rounded corners.

Soft shadows.

Minimal gradients.

Glassmorphism only where appropriate.

---

# Frontend Architecture

```text
src/

assets/

components/

layout/

ui/

features/

download/

history/

auth/

pages/

services/

hooks/

context/

types/

utils/

styles/
```

---

# Pages

Home

History

Downloads

Profile

Settings

About

FAQ

Privacy Policy

Terms

404

---

# Core Components

Navbar

Hero

URL Input

Video Preview Card

Quality Selector

Download Progress

Download Queue

Download History

Footer

Toast Notifications

Skeleton Loader

Confirmation Dialog

Theme Switch

Profile Menu

---

# Frontend Principles

Use reusable components.

No duplicated code.

Use custom hooks.

Strict TypeScript.

Lazy load routes.

Use React Query for server state.

Use Context only for global UI state.

---

# Authentication

Authentication is handled by Supabase.

Supported providers:

* Google
* Email + Password

Flow

```text
User

↓

Google Login

↓

Supabase Auth

↓

JWT

↓

React

↓

FastAPI

↓

JWT Verification

↓

Authorized Request
```

The backend never manages passwords.

Authentication is delegated to Supabase.

---

# Database Schema

## profiles

```text
id (uuid)

email

full_name

avatar_url

created_at
```

---

## downloads

```text
id

user_id

video_title

video_url

thumbnail

format

quality

file_size

download_status

created_at
```

---

## user_preferences

```text
user_id

theme

default_quality

default_format

language
```

---

# API Design

POST

/auth/session

Verify Supabase JWT

---

POST

/video/metadata

Returns

* title

* thumbnail

* duration

* available formats

---

POST

/download

Creates download job

Returns Job ID

---

GET

/download/{job_id}

Returns progress

---

GET

/history

Returns authenticated user's download history

---

DELETE

/history/{id}

Deletes history item

---

PUT

/preferences

Updates user settings

---

# Backend Structure

```text
backend/

app/

api/

auth/

core/

database/

models/

schemas/

services/

repositories/

workers/

utils/

main.py
```

---

# Service Layer

Separate business logic.

API routes should never contain downloader logic.

Example

Route

↓

Service

↓

Repository

↓

Database

---

# Download Pipeline

```text
Paste URL

↓

Validate URL

↓

Extract Metadata

↓

Display Preview

↓

Choose Format

↓

Start Download

↓

Track Progress

↓

Save History

↓

Return File
```

---

# Download Queue

Future enhancement

Support multiple concurrent downloads.

Queue management.

Retry failed downloads.

Cancellation.

---

# Error Handling

Never expose Python exceptions.

Return structured JSON.

Example

```json
{
  "success": false,
  "message": "Video unavailable."
}
```

---

# Security

Validate every URL.

Validate JWT.

Enable CORS.

Rate limit download endpoints.

Never expose service keys.

Store secrets in environment variables.

---

# Performance

Lazy loading

Memoization

Caching

Compression

Streaming downloads

Async FastAPI routes

Connection pooling

---

# Folder Structure

```text
youtube-downloader/

frontend/

backend/

docs/

README.md

ARCHITECTURE.md

API.md

DATABASE.md

DEPLOYMENT.md
```

---

# Deployment Flow

Frontend

GitHub

↓

Vercel

Backend

GitHub

↓

Render

Database

↓

Supabase

---

# Development Phases

## Phase 1

Design

Generate UI with Google Stitch

Build reusable React components

Responsive layout

Dark mode

Mock data

---

## Phase 2

Backend

FastAPI

yt-dlp integration

FFmpeg

Metadata extraction

Download API

---

## Phase 3

Authentication

Supabase

Google Login

Profile creation

Protected routes

JWT verification

---

## Phase 4

Database

History

Preferences

Download records

User profile

---

## Phase 5

Production

Deploy frontend

Deploy backend

Connect database

Configure environment variables

---

## Phase 6

Enhancements

Playlist support

Audio extraction

Background jobs

Notifications

Analytics

Search

Pagination

Caching

---

# Code Standards

* TypeScript strict mode
* ESLint
* Prettier
* Absolute imports
* Feature-first folder structure
* Functional React components
* No inline business logic
* Reusable hooks
* Clean API contracts
* Comprehensive error handling
* Meaningful commit messages

---

# Definition of Done

A feature is considered complete only when:

* It matches the Google Stitch design.
* It is fully responsive.
* Accessibility basics are implemented.
* Authentication is enforced where required.
* Backend endpoints are documented.
* Errors are handled gracefully.
* Loading and empty states exist.
* Dark mode is supported.
* Code passes linting.
* The feature is deployable without manual changes.

---

# Future Roadmap

* Android application (Kotlin + Jetpack Compose)
* iOS application
* Download analytics dashboard
* Browser extension
* Progressive Web App
* Multi-language support
* Background processing with Redis + Celery
* Admin dashboard
* User quotas and premium plans
* Cloud storage integration

---

# Guiding Principle

Every implementation decision should optimize for:

1. Clean Architecture
2. Production Readiness
3. Reusability
4. Scalability
5. Maintainability
6. Exceptional User Experience

If a proposed implementation compromises these goals, refactor the design rather than lowering the quality standard.
