from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select

BASE = Path(__file__).resolve().parents[2]
FRONTEND_DIR = BASE / 'frontend'
DB_FILE = BASE / 'backend' / 'surveys.db'

app = FastAPI(title="Survey App Backend")

# allow requests from local frontend/dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Survey(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    sex: str
    location: str
    native_language: str

# ensure directory
DB_FILE.parent.mkdir(parents=True, exist_ok=True)
engine = create_engine(f"sqlite:///{DB_FILE}", echo=False)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Serve static frontend
# NOTE: mount the frontend after API routes to avoid StaticFiles shadowing API paths

@app.post('/api/surveys', response_model=Survey)
def create_survey(item: Survey):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

@app.get('/api/surveys', response_model=List[Survey])
def list_surveys():
    with Session(engine) as session:
        statement = select(Survey)
        results = session.exec(statement).all()
        return results

@app.get('/api/health')
def health():
    return {"status": "ok"}

# Serve static frontend at root — mount after API routes so `/api/*` works
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
