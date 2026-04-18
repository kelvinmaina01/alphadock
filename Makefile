# AlphaDock dev shortcuts (Repo Guide). On Windows without make, use npm / PowerShell equivalents in README.

.PHONY: dev web api compose-up compose-down

dev:
	npm run dev

web:
	cd apps/web && npm run dev

api:
	cd apps/api && . .venv/bin/activate 2>/dev/null || true; uvicorn app.main:app --reload --port 8000

compose-up:
	docker compose up -d

compose-down:
	docker compose down
