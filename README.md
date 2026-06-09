# InterviewIQ

InterviewIQ is an AI Interview Intelligence Platform for placement preparation. It combines secure authentication, PDF resume analysis, personalized mock interviews, AI-style answer evaluation, readiness analytics, and preparation roadmaps in a modern SaaS interface.

## Features

- JWT signup, login, protected routes, logout, and persistent sessions.
- PDF resume upload with text extraction, ATS scoring, skill detection, role prediction, and missing keyword suggestions.
- Personalized question generation by role, difficulty, company mode, and resume skills.
- Mock interview runner with sequential questions, progress, answer capture, and rubric evaluation.
- Dashboard analytics with readiness percentage, radar chart, trend graph, topic scores, weak areas, and history.
- AI roadmap generator with daily plan, weekly plan, priority topics, and suggested practice.
- PostgreSQL-ready schema, Docker backend, Vercel frontend configuration, and Render blueprint.

## Tech Stack

- Frontend: React, Tailwind CSS, React Router, Axios, Recharts, Lucide icons.
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT, Passlib, pypdf.
- Database: PostgreSQL, with a SQLite fallback for local development if `DATABASE_URL` is not set.
- AI: Provider adapter with deterministic mock outputs by default. Add OpenAI or Gemini integration behind `server/app/ai/provider.py`.

## Project Structure

```text
client/
  src/
    components/
    context/
    pages/
    services/
server/
  app/
    ai/
    auth/
    core/
    database/
    models/
    routers/
    schemas/
    services/
docs/
```

## Local Setup

Install frontend dependencies:

```bash
cd client
npm install
npm run dev
```

Install backend dependencies:

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Run PostgreSQL with Docker:

```bash
docker compose up postgres
```

Run the full backend stack with Docker:

```bash
docker compose up --build
```

## Environment

Backend variables live in `server/.env`:

```text
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/interviewiq
JWT_SECRET_KEY=change-this-long-random-secret
AI_PROVIDER=mock
CLIENT_ORIGIN=http://localhost:5173
```

Frontend variables live in `client/.env`:

```text
VITE_API_URL=http://localhost:8000/api
```

## Deployment

- Deploy `client` to Vercel. Set `VITE_API_URL` to the Render API URL plus `/api`.
- Deploy `server` to Render using `render.yaml` or the Dockerfile in `server`.
- Use a managed PostgreSQL database and set `DATABASE_URL`.
- Replace `JWT_SECRET_KEY` with a generated secret.

## Documentation

- Architecture: [docs/architecture.md](docs/architecture.md)
- PostgreSQL schema: [server/app/database/schema.sql](server/app/database/schema.sql)
- FastAPI interactive docs: `http://localhost:8000/docs`

## Screenshots

Add screenshots of the auth page, dashboard, resume analyzer, interview runner, and roadmap screen after deployment.
