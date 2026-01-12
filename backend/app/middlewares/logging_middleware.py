# backend/app/middlewares/logging_middleware.py
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.utils.logger import get_logger

logger = get_logger("request")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Simple request logging middleware.

    Logs method, path, status code and process time.
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "%s %s -> %s (%.2fms)",
            request.method,
            request.url.path,
            response.status_code,
            process_time_ms,
        )
        return response
