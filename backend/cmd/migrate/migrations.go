package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type migration struct {
	version  int
	upFile   string
	downFile string
}

func contextBackground() context.Context {
	return context.Background()
}

func ensureMigrationsTable(ctx context.Context, pool *pgxpool.Pool) error {
	_, err := pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version INT PRIMARY KEY,
			applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`)
	return err
}

func isApplied(ctx context.Context, pool *pgxpool.Pool, version int) (bool, error) {
	var count int
	err := pool.QueryRow(ctx, "SELECT COUNT(*) FROM schema_migrations WHERE version = $1", version).Scan(&count)
	return count > 0, err
}

func listMigrations() ([]migration, error) {
	dir := "migrations"
	entries, err := os.ReadDir(dir)
	if err != nil {
		// Try relative to executable / working dir from backend/
		dir = filepath.Join("backend", "migrations")
		entries, err = os.ReadDir(dir)
		if err != nil {
			return nil, fmt.Errorf("read migrations dir: %w", err)
		}
	}

	ups := make(map[int]string)
	for _, e := range entries {
		name := e.Name()
		if !strings.HasSuffix(name, ".up.sql") {
			continue
		}
		parts := strings.SplitN(name, "_", 2)
		if len(parts) < 2 {
			continue
		}
		v, err := strconv.Atoi(parts[0])
		if err != nil {
			continue
		}
		ups[v] = filepath.Join(dir, name)
	}

	var migrations []migration
	for v, up := range ups {
		down := strings.Replace(up, ".up.sql", ".down.sql", 1)
		migrations = append(migrations, migration{version: v, upFile: up, downFile: down})
	}
	sort.Slice(migrations, func(i, j int) bool { return migrations[i].version < migrations[j].version })
	return migrations, nil
}

func createMigration(name string) {
	dir := "migrations"
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		dir = filepath.Join("backend", "migrations")
	}
	_ = os.MkdirAll(dir, 0o755)

	entries, _ := os.ReadDir(dir)
	maxVersion := 0
	for _, e := range entries {
		parts := strings.SplitN(e.Name(), "_", 2)
		if len(parts) < 2 {
			continue
		}
		if v, err := strconv.Atoi(parts[0]); err == nil && v > maxVersion {
			maxVersion = v
		}
	}
	next := maxVersion + 1
	prefix := fmt.Sprintf("%06d_%s", next, name)
	upPath := filepath.Join(dir, prefix+".up.sql")
	downPath := filepath.Join(dir, prefix+".down.sql")
	_ = os.WriteFile(upPath, []byte("-- migration up\n"), 0o644)
	_ = os.WriteFile(downPath, []byte("-- migration down\n"), 0o644)
	fmt.Printf("created %s and %s\n", upPath, downPath)
	_ = time.Now()
}
