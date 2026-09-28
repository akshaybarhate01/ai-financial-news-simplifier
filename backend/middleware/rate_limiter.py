import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status

class RateLimiter:
    """Sliding-window in-memory rate limiter per IP address."""

    def __init__(self, requests_limit: int = 120, window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.clients: Dict[str, List[float]] = defaultdict(list)

    def check_rate_limit(self, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        window_start = now - self.window_seconds

        # Filter out timestamps older than the window
        self.clients[client_ip] = [ts for ts in self.clients[client_ip] if ts > window_start]

        if len(self.clients[client_ip]) >= self.requests_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {self.requests_limit} requests per {self.window_seconds} seconds."
            )

        self.clients[client_ip].append(now)

rate_limiter = RateLimiter(requests_limit=120, window_seconds=60)
