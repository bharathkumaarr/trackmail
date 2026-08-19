package middleware_test

import (
	"testing"
	"time"

	"github.com/bharathkumaarr/trackmail/backend/internal/middleware"
)

func TestDedupeCache(t *testing.T) {
	cache := middleware.NewDedupeCache(100 * time.Millisecond)
	key := "token:iphash"

	if !cache.ShouldRecord(key) {
		t.Error("first request should be recorded")
	}
	if cache.ShouldRecord(key) {
		t.Error("duplicate within window should be deduplicated")
	}

	time.Sleep(150 * time.Millisecond)
	if !cache.ShouldRecord(key) {
		t.Error("after window, should record again")
	}
}
