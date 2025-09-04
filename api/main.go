package handler

import (
	"context"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
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
func rootHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	initDB(ctx)

	var now time.Time
	err := dbpool.QueryRow(ctx, "SELECT NOW()").Scan(&now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Connected to Supabase!", "time": now})
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

func signinHandler(c *gin.Context) {
	type SigninRequest struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var req SigninRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	initDB(ctx)

	var dbPassword string
	err := dbpool.QueryRow(ctx, "SELECT password FROM users WHERE username=$1", req.Username).Scan(&dbPassword)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if req.Password != dbPassword {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Signin successful"})
}

// --- Setup Router ---
func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger())

	r.GET("/api/", rootHandler)
	r.GET("/api/health", healthHandler)
	r.POST("/api/signin", signinHandler)

	return r
}

// --- Vercel Handler ---
func Handler(w http.ResponseWriter, r *http.Request) {
	if router == nil {
		router = setupRouter()
	}
	router.ServeHTTP(w, r)
}
