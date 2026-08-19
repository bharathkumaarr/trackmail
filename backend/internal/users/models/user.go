package models

import "time"

type User struct {
	ID           string    `json:"id"`
	GoogleUserID string    `json:"google_user_id"`
	Email        string    `json:"email"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
