# backend/app/middlewares/auth_middleware.py
"""
Optional auth middleware.

In this project, we rely on FastAPI dependencies (get_current_user/get_current_admin)
for route-level auth, which is usually cleaner and more explicit.

If you ever need global auth behavior (e.g., attach user to request.state for logging),
you can implement it here.
"""
