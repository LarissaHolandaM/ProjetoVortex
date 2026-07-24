class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Não autorizado"):
        super().__init__(message, status_code=401)


class ValidationError(AppError):
    def __init__(self, message: str):
        super().__init__(message, status_code=422)
