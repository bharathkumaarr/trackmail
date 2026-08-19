package main

import (
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("usage: migrate [up|down|create <name>]")
		os.Exit(1)
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		fmt.Println("DATABASE_URL is required")
		os.Exit(1)
	}

	cmd := os.Args[1]
	switch cmd {
	case "up":
		if err := runMigrations(databaseURL, "up"); err != nil {
			fmt.Fprintf(os.Stderr, "migrate up: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("migrations applied")
	case "down":
		if err := runMigrations(databaseURL, "down"); err != nil {
			fmt.Fprintf(os.Stderr, "migrate down: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("migrations rolled back")
	case "create":
		if len(os.Args) < 3 {
			fmt.Println("usage: migrate create <name>")
			os.Exit(1)
		}
		createMigration(os.Args[2])
	default:
		fmt.Printf("unknown command: %s\n", cmd)
		os.Exit(1)
	}
}

func runMigrations(databaseURL, direction string) error {
	ctx := contextBackground()
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return err
	}
	defer pool.Close()

	if err := ensureMigrationsTable(ctx, pool); err != nil {
		return err
	}

	migrations, err := listMigrations()
	if err != nil {
		return err
	}

	if direction == "up" {
		for _, m := range migrations {
			applied, err := isApplied(ctx, pool, m.version)
			if err != nil {
				return err
			}
			if applied {
				continue
			}
			sql, err := os.ReadFile(m.upFile)
			if err != nil {
				return err
			}
			tx, err := pool.Begin(ctx)
			if err != nil {
				return err
			}
			if _, err := tx.Exec(ctx, string(sql)); err != nil {
				tx.Rollback(ctx)
				return fmt.Errorf("migration %d: %w", m.version, err)
			}
			if _, err := tx.Exec(ctx, "INSERT INTO schema_migrations (version) VALUES ($1)", m.version); err != nil {
				tx.Rollback(ctx)
				return err
			}
			if err := tx.Commit(ctx); err != nil {
				return err
			}
			fmt.Printf("applied migration %d\n", m.version)
		}
	} else {
		for i := len(migrations) - 1; i >= 0; i-- {
			m := migrations[i]
			applied, err := isApplied(ctx, pool, m.version)
			if err != nil {
				return err
			}
			if !applied {
				continue
			}
			sql, err := os.ReadFile(m.downFile)
			if err != nil {
				return err
			}
			tx, err := pool.Begin(ctx)
			if err != nil {
				return err
			}
			if _, err := tx.Exec(ctx, string(sql)); err != nil {
				tx.Rollback(ctx)
				return fmt.Errorf("rollback %d: %w", m.version, err)
			}
			if _, err := tx.Exec(ctx, "DELETE FROM schema_migrations WHERE version = $1", m.version); err != nil {
				tx.Rollback(ctx)
				return err
			}
			if err := tx.Commit(ctx); err != nil {
				return err
			}
			fmt.Printf("rolled back migration %d\n", m.version)
		}
	}
	return nil
}
