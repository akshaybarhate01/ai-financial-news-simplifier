from typing import Any, Optional
from fastapi.responses import JSONResponse

def create_response(
    success: bool,
    message: str,
    data: Optional[Any] = None,
    error: Optional[Any] = None,
    status_code: int = 200
) -> JSONResponse:
    content = {
        "success": success,
        "message": message,
        "data": data,
        "error": error
    }
    return JSONResponse(status_code=status_code, content=content)

def success_response(data: Any = None, message: str = "Operation completed successfully", status_code: int = 200) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
        "error": None
    }

def error_dict(message: str, code: str = "ERROR", details: Any = None) -> dict:
    return {
        "success": False,
        "message": message,
        "data": None,
        "error": {
            "code": code,
            "details": details or message
        }
    }
