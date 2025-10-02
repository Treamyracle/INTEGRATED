package handler

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
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

// =====================
// Init DB Pool Aman
// =====================
func initDB(ctx context.Context) {
	once.Do(func() {
		databaseUrl := os.Getenv("SUPABASE_DB_URL")
		if databaseUrl == "" {
			panic("SUPABASE_DB_URL is not set")
		}

		config, err := pgxpool.ParseConfig(databaseUrl)
		if err != nil {
			panic("Failed to parse DB config: " + err.Error())
		}

		// Opsional: batasi max connection
		config.MaxConns = 10

		pool, err := pgxpool.NewWithConfig(ctx, config)
		if err != nil {
			panic("Unable to create connection pool: " + err.Error())
		}
		dbpool = pool
		log.Println("Database pool siap digunakan")
	})
}

// =====================
// Signup Handler
// =====================
func signupHandler(c *gin.Context) {
	type SignupRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Username string `json:"username" binding:"required"`
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

	_, err = dbpool.Exec(ctx, "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)", req.Email, req.Username, string(hashedPassword))
	if err != nil {
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

// =====================
// Signin Handler Aman
// =====================
func signinHandler(c *gin.Context) {
	type SigninRequest struct {
		Identifier string `json:"identifier" binding:"required"`
		Password   string `json:"password" binding:"required"`
	}

	var req SigninRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	log.Printf("Mencoba login dengan identifier: %s", req.Identifier)

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	initDB(ctx)

	var dbHashedPassword string
	var sqlQuery string

	if strings.Contains(req.Identifier, "@") {
		sqlQuery = "SELECT password FROM users WHERE email=$1"
	} else {
		sqlQuery = "SELECT password FROM users WHERE username=$1"
	}

	log.Printf("Menjalankan query: %s", sqlQuery)

	// Gunakan QueryRow biasa → simple protocol, tidak clash statement
	err := dbpool.QueryRow(ctx, sqlQuery, req.Identifier).Scan(&dbHashedPassword)
	if err != nil {
		log.Printf("User tidak ditemukan atau error: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Bandingkan password
	err = bcrypt.CompareHashAndPassword([]byte(dbHashedPassword), []byte(req.Password))
	if err != nil {
		log.Printf("Password tidak cocok: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	log.Println("Perbandingan bcrypt BERHASIL!")
	c.JSON(http.StatusOK, gin.H{"message": "Signin successful"})
}

// =====================
// Health Handler
// =====================
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

// =====================
// Setup Router
// =====================
func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger())

	r.POST("/api/signup", signupHandler)
	r.POST("/api/signin", signinHandler)
	r.GET("/api/health", healthHandler)

	return r
}

// =====================
// Vercel Handler
// =====================
func Handler(w http.ResponseWriter, r *http.Request) {
	if router == nil {
		router = setupRouter()
	}
	router.ServeHTTP(w, r)
}
