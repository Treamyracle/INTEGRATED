package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"google.golang.org/api/idtoken"
)

var db *pgxpool.Pool
var router *gin.Engine

// initDB menginisialisasi koneksi ke Supabase (PostgreSQL) menggunakan pgxpool
func initDB() {
	err := godotenv.Load() // Muat file .env jika ada
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	connStr := os.Getenv("SUPABASE_DB_URL")
	if connStr == "" {
		log.Fatal("SUPABASE_DB_URL environment variable is not set")
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatalf("Unable to parse database config: %v", err)
	}

	// Set additional connection parameters
	config.ConnConfig.RuntimeParams = map[string]string{
		"application_name": "myapp",
	}

	log.Println("Connecting to DB...")
	db, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.Ping(ctx); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}

	log.Println("Database connected successfully")
}

// User mewakili data pada tabel users
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"` // Untuk akun lokal; untuk Google Sign In bisa dikosongkan
}

// FlowItem mewakili data pada tabel flowlist yang terikat ke user melalui UserID
type FlowItem struct {
	ID       int       `json:"id"`
	UserID   int       `json:"userId"`
	Category string    `json:"category"`
	Amount   float64   `json:"amount"`
	Date     time.Time `json:"date"`
}

// signInHandler menangani proses sign in baik melalui Google (dengan token)
// maupun sign in lokal dengan username dan password.
func signInHandler(c *gin.Context) {
	var req struct {
		Token    string `json:"token"`
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	ctx := context.Background()

	// Jika token tersedia, lakukan sign in via Google
	if req.Token != "" {
		// Validasi token Google menggunakan client ID Supabase Anda
		payload, err := idtoken.Validate(ctx, req.Token, "418414887688-u7fg0bshmafc4djrvcj9ueioil4kht2q.apps.googleusercontent.com")
		if err != nil {
			log.Printf("Google token validation error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		email, ok := payload.Claims["email"].(string)
		if !ok || email == "" {
			log.Println("Email not found in token payload")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Email not found in token"})
			return
		}

		log.Printf("Google sign in: %s", email)

		var user User
		err = db.QueryRow(ctx, "SELECT id, email, username, password FROM users WHERE email = $1", email).
			Scan(&user.ID, &user.Email, &user.Username, &user.Password)
		if err != nil {
			// Jika user tidak ditemukan, buat user baru
			if errors.Is(err, pgx.ErrNoRows) {
				err = db.QueryRow(ctx,
					"INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username, password",
					email, email, "",
				).Scan(&user.ID, &user.Email, &user.Username, &user.Password)
				if err != nil {
					log.Printf("Insert user error: %v", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
					return
				}
			} else {
				log.Printf("Query user error: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"user": user})
		return
	}

	// Jika username dan password tersedia, lakukan sign in lokal
	if req.Username != "" && req.Password != "" {
		var user User
		err := db.QueryRow(ctx, "SELECT id, email, username, password FROM users WHERE username = $1", req.Username).
			Scan(&user.ID, &user.Email, &user.Username, &user.Password)
		if err != nil {
			log.Printf("Query local user error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}
		if user.Password != req.Password {
			log.Printf("Invalid password for user %s", req.Username)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		log.Printf("Local sign in: %s", user.Username)
		c.JSON(http.StatusOK, gin.H{"user": user})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"error": "Either token or username and password must be provided"})
}

// getFlowListHandler mengembalikan flowlist untuk user tertentu berdasarkan query parameter ?userId=
func getFlowListHandler(c *gin.Context) {
	userIdStr := c.Query("userId")
	if userIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId parameter is required"})
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}

	ctx := context.Background()
	rows, err := db.Query(ctx, "SELECT id, user_id, category, amount, date FROM flowlist WHERE user_id = $1", userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var items []FlowItem
	for rows.Next() {
		var item FlowItem
		if err := rows.Scan(&item.ID, &item.UserID, &item.Category, &item.Amount, &item.Date); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, items)
}

// addFlowItemHandler menambahkan flow item baru untuk user tertentu
func addFlowItemHandler(c *gin.Context) {
	var newItem struct {
		UserID   int     `json:"userId" binding:"required"`
		Category string  `json:"category" binding:"required"`
		Amount   float64 `json:"amount" binding:"required"`
		Date     string  `json:"date" binding:"required"` // format YYYY-MM-DD
	}
	if err := c.ShouldBindJSON(&newItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", newItem.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected YYYY-MM-DD"})
		return
	}

	ctx := context.Background()
	var item FlowItem
	err = db.QueryRow(ctx,
		"INSERT INTO flowlist (user_id, category, amount, date) VALUES ($1, $2, $3, $4) RETURNING id, user_id, category, amount, date",
		newItem.UserID, newItem.Category, newItem.Amount, parsedDate,
	).Scan(&item.ID, &item.UserID, &item.Category, &item.Amount, &item.Date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add flow item"})
		return
	}

	c.JSON(http.StatusOK, item)
}

// removeFlowItemHandler menghapus flow item berdasarkan id, hanya jika item milik user yang sesuai
func removeFlowItemHandler(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
		return
	}

	userIdStr := c.Query("userId")
	if userIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId parameter is required"})
		return
	}
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}

	ctx := context.Background()
	cmd, err := db.Exec(ctx, "DELETE FROM flowlist WHERE id = $1 AND user_id = $2", id, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
		return
	}
	if cmd.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found or unauthorized deletion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed"})
}

func getFlowItemHandler(c *gin.Context) {
	// Log request
	log.Printf("Getting flow item with ID: %s", c.Param("id"))

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Printf("Invalid ID format: %s, error: %v", idStr, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
		return
	}

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var item FlowItem
	err = db.QueryRow(ctx, `
		SELECT id, user_id, category, amount, date 
		FROM flowlist 
		WHERE id = $1
	`, id).Scan(&item.ID, &item.UserID, &item.Category, &item.Amount, &item.Date)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			log.Printf("No flow item found with ID: %d", id)
			c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		} else {
			log.Printf("Database error retrieving flow item with id %d: %v", id, err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"details": err.Error(),
			})
		}
		return
	}

	log.Printf("Successfully retrieved flow item: %+v", item)
	c.JSON(http.StatusOK, item)
}

func init() {
	// Set Gin to release mode
	gin.SetMode(gin.ReleaseMode)

	// Initialize database with retry
	maxRetries := 3
	var err error
	for i := 0; i < maxRetries; i++ {
		err = initDBWithTimeout()
		if err == nil {
			break
		}
		log.Printf("Failed to initialize DB (attempt %d/%d): %v", i+1, maxRetries, err)
		if i < maxRetries-1 {
			time.Sleep(time.Second * 2)
		}
	}
	if err != nil {
		log.Fatalf("Failed to initialize database after %d attempts: %v", maxRetries, err)
	}

	router = gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/api/signin", signInHandler)
	router.GET("/api/flowlist", getFlowListHandler)
	router.GET("/api/flowlist/:id", getFlowItemHandler)
	router.POST("/api/flowlist", addFlowItemHandler)
	router.DELETE("/api/flowlist/:id", removeFlowItemHandler)
}

// initDBWithTimeout attempts to initialize the database connection with a timeout
func initDBWithTimeout() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	connStr := os.Getenv("SUPABASE_DB_URL")
	if connStr == "" {
		return errors.New("SUPABASE_DB_URL environment variable is not set")
	}

	// Parse the connection string to modify it
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return fmt.Errorf("unable to parse database config: %v", err)
	}

	// Force specific connection parameters
	config.ConnConfig.RuntimeParams = map[string]string{
		"application_name":        "myapp",
		"tcp_keepalives_idle":     "60",
		"tcp_keepalives_interval": "30",
		"tcp_keepalives_count":    "5",
	}

	// Set connection pool settings
	config.MaxConns = 5
	config.MinConns = 1
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute
	config.HealthCheckPeriod = time.Minute

	// Add connection timeout
	config.ConnConfig.ConnectTimeout = 10 * time.Second

	log.Printf("Attempting to connect to DB at host: %s", config.ConnConfig.Host)

	// Create connection pool
	db, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %v", err)
	}

	// Test connection with retry
	for i := 0; i < 3; i++ {
		err = db.Ping(ctx)
		if err == nil {
			break
		}
		log.Printf("Ping attempt %d failed: %v", i+1, err)
		time.Sleep(time.Second * 2)
	}
	if err != nil {
		return fmt.Errorf("unable to ping database after retries: %v", err)
	}

	log.Println("Database connected successfully")
	return nil
}

// Handler adalah entry point yang akan dipanggil oleh Vercel sebagai fungsi serverless.
func Handler(w http.ResponseWriter, r *http.Request) {
	// Add panic recovery
	defer func() {
		if err := recover(); err != nil {
			log.Printf("Panic recovered in Handler: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Internal server error",
			})
		}
	}()

	router.ServeHTTP(w, r)
}
