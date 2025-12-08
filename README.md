# Survey App

A minimal Survey application (frontend + backend) scaffolded for quick local testing.

Structure:
- `frontend/` - static survey page (index.html)
- `backend/` - FastAPI backend with SQLite (SQLModel)

Quick start (Linux / macOS):

1. Create a virtual environment and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Start the backend (serves the frontend static files):

```bash
uvicorn backend.app.main:app --reload --port 8001
```

3. Open your browser to `http://localhost:8001/` to view the survey page.

API:
- `POST /api/surveys` - create a survey submission
- `GET /api/surveys` - list submissions

Note: This is a minimal scaffold. For production use consider configuring a proper database (Postgres), HTTPS, and robust validation.
