.PHONY: setup backend-preflight dev demo test test-e2e lint api-types

setup:
	UV_CACHE_DIR=$(CURDIR)/.uv-cache uv sync --directory backend
	pnpm --dir frontend install

backend-preflight:
	@cd backend && .venv/bin/python -m scripts.dev_backend_preflight

dev: backend-preflight
	@set -eu; \
	(cd backend && exec .venv/bin/python -m uvicorn app.main:app --reload --port 8000) & \
	backend_pid=$$!; \
	trap 'kill -TERM "$$backend_pid" 2>/dev/null || true; wait "$$backend_pid" 2>/dev/null || true' INT TERM EXIT; \
	cd frontend && pnpm dev

demo: backend-preflight
	@set -eu; \
	(cd backend && exec .venv/bin/python -m uvicorn app.main:app --port 8000) & \
	backend_pid=$$!; \
	trap 'kill -TERM "$$backend_pid" 2>/dev/null || true; wait "$$backend_pid" 2>/dev/null || true' INT TERM EXIT; \
	cd frontend && pnpm dev

test:
	cd backend && UV_CACHE_DIR=$(CURDIR)/.uv-cache uv run python -m pytest
	pnpm --dir frontend test -- --run

test-e2e:
	pnpm --dir frontend test:e2e

lint:
	cd backend && UV_CACHE_DIR=$(CURDIR)/.uv-cache uv run ruff check .
	pnpm --dir frontend lint

api-types:
	cd backend && UV_CACHE_DIR=$(CURDIR)/.uv-cache uv run python -m scripts.export_openapi
	pnpm --dir frontend exec openapi-typescript ../backend/openapi.json -o src/api/schema.d.ts
