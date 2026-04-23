# Talent Scout App Monorepo

This project uses a monorepo structure with separate frontend and backend apps.

## Project Structure

- `/frontend`: React + Vite + TypeScript + Tailwind + shadcn UI
- `/backend`: Express + MongoDB (Mongoose) + JWT auth + file uploads

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas (or local MongoDB)

## Environment Setup

Create `backend/.env` from `backend/.env.example` and set:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN` (default `http://localhost:8080`)
- `ADMIN_EMAIL`

Create `frontend/.env` with:

- `VITE_API_BASE_URL=http://localhost:5000`

## Installation

```sh
npm run install:all
```

## Development

Run backend:

```sh
npm run dev:backend
```

Run frontend:

```sh
npm run dev:frontend
```

## Seed Sample Data

```sh
npm --prefix backend run seed
```

This creates sample admin/candidate users, profiles, jobs, and applications.

## Production Build (Frontend)

```sh
npm run build:frontend
```
