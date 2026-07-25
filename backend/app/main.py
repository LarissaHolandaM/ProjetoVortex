from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import anuncios, auth, favoritos, uploads
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
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_origin_regex=settings.CORS_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(auth.router)
app.include_router(anuncios.router)
app.include_router(favoritos.router)
app.include_router(uploads.router)


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
