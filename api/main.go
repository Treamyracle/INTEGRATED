package handler

import (
	"context"
	"fmt"
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

func initDB(ctx context.Context) {
	once.Do(func() {
		databaseUrl := os.Getenv("SUPABASE_DB_URL")
		if databaseUrl == "" {
			panic("SUPABASE_DB_URL is not set")
		}

		pool, err := pgxpool.New(ctx, databaseUrl)
		if err != nil {
			panic(fmt.Sprintf("Unable to create connection pool: %v", err))
		}
		dbpool = pool
	})
}

func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger())

	r.GET("api/", func(c *gin.Context) {
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
	})

	r.GET("api/health", func(c *gin.Context) {
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
	})

	return r
}

// exported Handler untuk Vercel
func Handler(w http.ResponseWriter, r *http.Request) {
	if router == nil {
		router = setupRouter()
	}
	router.ServeHTTP(w, r)
}
