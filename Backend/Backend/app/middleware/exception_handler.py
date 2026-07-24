from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.exceptions import AppError, UnauthorizedError, ValidationError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message, "error": exc.__class__.__name__})

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError):
        errors = [
            {"loc": error.get("loc", []), "msg": error.get("msg", "Campo inválido"), "type": error.get("type", "value_error")}
            for error in exc.errors()
        ]
        return JSONResponse(status_code=422, content={"detail": errors, "error": "ValidationError"})

    @app.exception_handler(UnauthorizedError)
    async def handle_unauthorized_error(request: Request, exc: UnauthorizedError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message, "error": exc.__class__.__name__})

    @app.exception_handler(ValidationError)
    async def handle_validation_exception(request: Request, exc: ValidationError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message, "error": exc.__class__.__name__})
