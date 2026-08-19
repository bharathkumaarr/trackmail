package repositories

import (
	"context"

	"github.com/bharathkumaarr/trackmail/backend/internal/users/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) UpsertByGoogleID(ctx context.Context, googleUserID, email string) (*models.User, error) {
	query := `
		INSERT INTO users (google_user_id, email)
		VALUES ($1, $2)
		ON CONFLICT (google_user_id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW()
		RETURNING id, google_user_id, email, created_at, updated_at
	`
	var u models.User
	err := r.pool.QueryRow(ctx, query, googleUserID, email).Scan(
		&u.ID, &u.GoogleUserID, &u.Email, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (*models.User, error) {
	query := `SELECT id, google_user_id, email, created_at, updated_at FROM users WHERE id = $1`
	var u models.User
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&u.ID, &u.GoogleUserID, &u.Email, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
