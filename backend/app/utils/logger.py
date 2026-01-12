# backend/app/utils/logger.py
import logging


def get_logger(name: str = "construction_app") -> logging.Logger:
    """
    Get a named logger, configured once.

    Uvicorn already configures root loggers in production, so we avoid
    re-adding handlers if they exist.
    """
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger
