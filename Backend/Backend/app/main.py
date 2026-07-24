from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import anuncios, auth
from app.core.config import get_port, settings
from app.core.database import Base, engine
from app.middleware.exception_handler import register_exception_handlers


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API REST para gestão de anúncios com autenticação e validações.",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)

app.include_router(auth.router)
app.include_router(anuncios.router)


@app.get("/")
def root():
    return {
        "message": "Vortex API online",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


Base.metadata.create_all(bind=engine)
