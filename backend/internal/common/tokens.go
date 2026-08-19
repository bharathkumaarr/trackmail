package common

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
)

const TrackingTokenBytes = 32

// GenerateTrackingToken creates a cryptographically secure random token.
func GenerateTrackingToken() (raw string, hash string, err error) {
	b := make([]byte, TrackingTokenBytes)
	if _, err = rand.Read(b); err != nil {
		return "", "", fmt.Errorf("generate token: %w", err)
	}
	raw = base64.RawURLEncoding.EncodeToString(b)
	hash = HashToken(raw)
	return raw, hash, nil
}

func HashToken(token string) string {
	h := sha256.Sum256([]byte(token))
	return hex.EncodeToString(h[:])
}

func HashIP(ip, salt string) string {
	h := sha256.Sum256([]byte(salt + ip))
	return hex.EncodeToString(h[:])
}

// ValidateTokenFormat checks that a token looks like a valid base64url string of sufficient length.
func ValidateTokenFormat(token string) bool {
	if len(token) < 32 || len(token) > 64 {
		return false
	}
	decoded, err := base64.RawURLEncoding.DecodeString(token)
	if err != nil {
		return false
	}
	return len(decoded) >= 24
}
