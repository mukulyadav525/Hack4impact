from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "govtrack",
    broker=f"redis://{settings.REDIS_HOST}:6379/0",
    backend=f"redis://{settings.REDIS_HOST}:6379/1"
)

celery_app.conf.task_routes = {
    "app.worker.process_submission": "submission-queue",
}

celery_app.conf.update(task_track_started=True)
