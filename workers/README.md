# Workers

Long-running docking, batch screens, and structure fetch will run here (Celery/RQ + Redis).

The API will enqueue jobs and persist results to PostgreSQL; workers publish progress events to Redis for WebSocket/SSE fan-out in `apps/api`.
