package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// IPRateLimiter provides in-memory per-IP rate limiting.
// For multi-instance deployments, replace with a shared rate limiter (e.g. Redis).
type IPRateLimiter struct {
	mu       sync.Mutex
	limiters map[string]*rate.Limiter
	r        rate.Limit
	b        int
}

func NewIPRateLimiter(rps float64, burst int) *IPRateLimiter {
	return &IPRateLimiter{
		limiters: make(map[string]*rate.Limiter),
		r:        rate.Limit(rps),
		b:        burst,
	}
}

func (l *IPRateLimiter) getLimiter(ip string) *rate.Limiter {
	l.mu.Lock()
	defer l.mu.Unlock()

	lim, ok := l.limiters[ip]
	if !ok {
		lim = rate.NewLimiter(l.r, l.b)
		l.limiters[ip] = lim
	}
	return lim
}

func (l *IPRateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := clientIP(r)
		if !l.getLimiter(ip).Allow() {
			http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		return xff
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// DedupeCache prevents duplicate open events within a time window.
type DedupeCache struct {
	mu    sync.Mutex
	seen  map[string]time.Time
	window time.Duration
}

func NewDedupeCache(window time.Duration) *DedupeCache {
	d := &DedupeCache{
		seen:   make(map[string]time.Time),
		window: window,
	}
	go d.cleanup()
	return d
}

func (d *DedupeCache) ShouldRecord(key string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	now := time.Now()
	if last, ok := d.seen[key]; ok && now.Sub(last) < d.window {
		return false
	}
	d.seen[key] = now
	return true
}

func (d *DedupeCache) cleanup() {
	ticker := time.NewTicker(d.window)
	for range ticker.C {
		d.mu.Lock()
		now := time.Now()
		for k, t := range d.seen {
			if now.Sub(t) > d.window*2 {
				delete(d.seen, k)
			}
		}
		d.mu.Unlock()
	}
}
