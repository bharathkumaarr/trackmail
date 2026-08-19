package common_test

import (
	"testing"

	"github.com/bharathkumaarr/trackmail/backend/internal/common"
)

func TestGenerateTrackingToken(t *testing.T) {
	raw, hash, err := common.GenerateTrackingToken()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(raw) < 32 {
		t.Errorf("token too short: %d", len(raw))
	}
	if hash == "" {
		t.Error("hash should not be empty")
	}
	if hash == raw {
		t.Error("hash should differ from raw token")
	}
}

func TestValidateTokenFormat(t *testing.T) {
	raw, _, err := common.GenerateTrackingToken()
	if err != nil {
		t.Fatal(err)
	}
	if !common.ValidateTokenFormat(raw) {
		t.Error("valid token rejected")
	}
	if common.ValidateTokenFormat("short") {
		t.Error("short token accepted")
	}
	if common.ValidateTokenFormat("") {
		t.Error("empty token accepted")
	}
}

func TestHashTokenDeterministic(t *testing.T) {
	h1 := common.HashToken("test-token")
	h2 := common.HashToken("test-token")
	if h1 != h2 {
		t.Error("hash should be deterministic")
	}
}

func TestHashIP(t *testing.T) {
	h1 := common.HashIP("192.168.1.1", "salt")
	h2 := common.HashIP("192.168.1.1", "salt")
	h3 := common.HashIP("192.168.1.2", "salt")
	if h1 != h2 {
		t.Error("same IP+salt should produce same hash")
	}
	if h1 == h3 {
		t.Error("different IPs should produce different hashes")
	}
}
