.PHONY: dev test lint migrate-up migrate-down migrate-create docker-up docker-down build-ext

DATABASE_URL ?= postgres://mailtrack:mailtrack@localhost:5432/mailtrack?sslmode=disable

docker-up:
	docker compose up -d

docker-down:
	docker compose down

migrate-up:
	cd backend && DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate up

migrate-down:
	cd backend && DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate down

migrate-create:
	@read -p "Migration name: " name; \
	cd backend && go run ./cmd/migrate create $$name

dev:
	cd backend && go run ./cmd/server

test:
	cd backend && go test ./... -count=1

lint:
	cd backend && go vet ./...
	cd extension && npm run lint 2>/dev/null || true

build-ext:
	cd extension && npm run build

build:
	cd backend && go build -o bin/server ./cmd/server
	cd extension && npm run build
