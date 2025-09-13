package handler

import (
	"context"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt" // Import library bcrypt
)

var (
	dbpool *pgxpool.Pool
	once   sync.Once
	router *gin.Engine
)

// --- Database Setup ---
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

// --- Route Handlers ---

// signupHandler untuk mendaftarkan pengguna baru
func signupHandler(c *gin.Context) {
	type SignupRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	// Hash password sebelum disimpan
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	initDB(ctx)

	// Simpan pengguna baru ke database
	_, err = dbpool.Exec(ctx, "INSERT INTO users (email, password) VALUES ($1, $2)", req.Email, string(hashedPassword))
	if err != nil {
		// Kemungkinan email sudah ada (karena constraint UNIQUE)
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Signup successful"})
}

// signinHandler diperbarui untuk menggunakan email
func signinHandler(c *gin.Context) {
	// Request body sekarang menggunakan Email
	type SigninRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
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
	// Query database berdasarkan email, bukan username
	err := dbpool.QueryRow(ctx, "SELECT password FROM users WHERE email=$1", req.Email).Scan(&dbHashedPassword)
	if err != nil {
		// Jika email tidak ditemukan atau ada error lain
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Bandingkan password yang diinput dengan hash dari database
	err = bcrypt.CompareHashAndPassword([]byte(dbHashedPassword), []byte(req.Password))
	if err != nil {
		// Jika password tidak cocok
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
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
