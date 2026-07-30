.PHONY: setup dev test test-e2e lint api-types

setup:
	UV_CACHE_DIR=$(CURDIR)/.uv-cache uv sync --directory backend
	pnpm --dir frontend install

dev:
	@trap 'kill 0' INT TERM EXIT; \
	(cd backend && UV_CACHE_DIR=$(CURDIR)/.uv-cache uv run uvicorn app.main:app --reload --port 8000) & \
	(cd frontend && pnpm dev)

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
