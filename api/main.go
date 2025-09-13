package handler

import (
	"context"
	"net/http"
	"os"
	"strings" // <-- Tambahkan import ini
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

var (
	dbpool *pgxpool.Pool
	once   sync.Once
	router *gin.Engine
)

// ... (fungsi initDB, signupHandler, healthHandler tetap sama) ...
func initDB(ctx context.Context) {
	once.Do(func() {
		databaseUrl := os.Getenv("SUPABASE_DB_URL")
		if databaseUrl == "" {
			panic("SUPABASE_DB_URL is not set")
		}

		pool, err := pgxpool.New(ctx, databaseUrl)
		if err != nil {
			panic("Unable to create connection pool: " + err.Error())
		}
		dbpool = pool
	})
}

func signupHandler(c *gin.Context) {
	type SignupRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Username string `json:"username" binding:"required"` // Tambahkan username saat signup
		Password string `json:"password" binding:"required"`
	}

	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	initDB(ctx)

	// Simpan pengguna baru dengan email DAN username
	_, err = dbpool.Exec(ctx, "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)", req.Email, req.Username, string(hashedPassword))
	if err != nil {
		// Cek error duplikat yang lebih spesifik jika perlu
		if strings.Contains(err.Error(), "users_email_key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		} else if strings.Contains(err.Error(), "users_username_key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Signup successful"})
}

// --- signinHandler yang Diperbarui ---
func signinHandler(c *gin.Context) {
	// Request body sekarang menerima 'identifier'
	type SigninRequest struct {
		Identifier string `json:"identifier" binding:"required"`
		Password   string `json:"password" binding:"required"`
	}

	var req SigninRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	initDB(ctx)

	var dbHashedPassword string
	var sqlQuery string

	// Cek apakah identifier adalah email atau username
	if strings.Contains(req.Identifier, "@") {
		// Jika mengandung '@', kita anggap itu email
		sqlQuery = "SELECT password FROM users WHERE email=$1"
	} else {
		// Jika tidak, kita anggap itu username
		sqlQuery = "SELECT password FROM users WHERE username=$1"
	}

	// Jalankan query yang sesuai
	err := dbpool.QueryRow(ctx, sqlQuery, req.Identifier).Scan(&dbHashedPassword)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Bandingkan password
	err = bcrypt.CompareHashAndPassword([]byte(dbHashedPassword), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Signin successful"})
}

func healthHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()
	initDB(ctx)

	var dbTime time.Time
	err := dbpool.QueryRow(ctx, "SELECT NOW()").Scan(&dbTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "db_error", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "healthy", "time": dbTime})
}

// --- Setup Router ---
func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger())

	// Tambahkan route baru untuk signup
	r.POST("/api/signup", signupHandler)
	r.POST("/api/signin", signinHandler)
	r.GET("/api/health", healthHandler)

	return r
}

// --- Vercel Handler ---
func Handler(w http.ResponseWriter, r *http.Request) {
	if router == nil {
		router = setupRouter()
	}
	router.ServeHTTP(w, r)
}
