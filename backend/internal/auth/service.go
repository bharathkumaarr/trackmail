package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/bharathkumaarr/trackmail/backend/internal/config"
	userrepo "github.com/bharathkumaarr/trackmail/backend/internal/users/repositories"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type Service struct {
	cfg        *config.Config
	userRepo   *userrepo.UserRepository
	oauth      *oauth2.Config
}

type GoogleUserInfo struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type AuthResult struct {
	Token string          `json:"token"`
	User  AuthUserResponse `json:"user"`
}

type AuthUserResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

func NewService(cfg *config.Config, userRepo *userrepo.UserRepository) *Service {
	oauth := &oauth2.Config{
		ClientID:     cfg.GoogleClientID,
		ClientSecret: cfg.GoogleClientSecret,
		RedirectURL:  cfg.GoogleRedirectURI,
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}
	return &Service{cfg: cfg, userRepo: userRepo, oauth: oauth}
}

func (s *Service) AuthURL(state string) string {
	return s.oauth.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func (s *Service) ExchangeCode(ctx context.Context, code string) (*AuthResult, error) {
	token, err := s.oauth.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("exchange code: %w", err)
	}

	userInfo, err := fetchGoogleUserInfo(ctx, token.AccessToken)
	if err != nil {
		return nil, err
	}

	return s.upsertAndIssueJWT(ctx, userInfo.Sub, userInfo.Email)
}

func (s *Service) ExchangeAccessToken(ctx context.Context, accessToken string) (*AuthResult, error) {
	userInfo, err := fetchGoogleUserInfo(ctx, accessToken)
	if err != nil {
		return nil, err
	}
	return s.upsertAndIssueJWT(ctx, userInfo.Sub, userInfo.Email)
}

func (s *Service) ExchangeIDToken(ctx context.Context, idToken string) (*AuthResult, error) {
	// For extension flow: verify ID token via Google's tokeninfo endpoint
	resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
	if err != nil {
		return nil, fmt.Errorf("verify id token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid id token")
	}

	var info struct {
		Sub   string `json:"sub"`
		Email string `json:"email"`
		Aud   string `json:"aud"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	if info.Aud != s.cfg.GoogleClientID {
		return nil, fmt.Errorf("token audience mismatch")
	}

	return s.upsertAndIssueJWT(ctx, info.Sub, info.Email)
}

func (s *Service) upsertAndIssueJWT(ctx context.Context, googleUserID, email string) (*AuthResult, error) {
	user, err := s.userRepo.UpsertByGoogleID(ctx, googleUserID, email)
	if err != nil {
		return nil, fmt.Errorf("upsert user: %w", err)
	}

	jwtToken, err := s.createJWT(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	return &AuthResult{
		Token: jwtToken,
		User: AuthUserResponse{
			ID:    user.ID,
			Email: user.Email,
		},
	}, nil
}

func (s *Service) ValidateJWT(tokenString string) (userID, email string, err error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(s.cfg.JWTSecret), nil
	})
	if err != nil || !token.Valid {
		return "", "", fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", "", fmt.Errorf("invalid claims")
	}

	uid, _ := claims["sub"].(string)
	em, _ := claims["email"].(string)
	if uid == "" {
		return "", "", fmt.Errorf("missing sub claim")
	}
	return uid, em, nil
}

func (s *Service) createJWT(userID, email string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   userID,
		"email": email,
		"iat":   time.Now().Unix(),
		"exp":   time.Now().Add(s.cfg.JWTExpiry).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWTSecret))
}

func GenerateState() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func fetchGoogleUserInfo(ctx context.Context, accessToken string) (*GoogleUserInfo, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://www.googleapis.com/oauth2/v3/userinfo", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("userinfo failed: %s", string(body))
	}

	var info GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	return &info, nil
}
