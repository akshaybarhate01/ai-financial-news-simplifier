import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from backend.middleware.prompt_guard import PromptSecurityException

logger = logging.getLogger("fintech_news.error_handler")

async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if isinstance(exc.detail, str) else "HTTP Exception occurred",
            "data": None,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "details": exc.detail
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    error_details = exc.errors()
    first_error = error_details[0] if error_details else {}
    msg = f"{first_error.get('loc', ['field'])[-1]}: {first_error.get('msg', 'Validation error')}"
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": f"Input validation failed: {msg}",
            "data": None,
            "error": {
                "code": "VALIDATION_ERROR",
                "details": error_details
            }
        }
    )

async def prompt_security_exception_handler(request: Request, exc: PromptSecurityException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": exc.message,
            "data": None,
            "error": {
                "code": exc.code,
                "details": "The prompt triggered cybersecurity guardrails and was safely rejected."
            }
        }
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhandled server error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected internal server error occurred. Our engineering team has been notified.",
            "data": None,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "details": str(exc) if "development" in str(request.url) else "Contact administrator."
            }
        }
    )
