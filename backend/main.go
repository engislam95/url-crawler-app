package main
import (
    "github.com/gin-gonic/gin"
    "backend/config"
    "backend/routes"
    "backend/crawler"
    "backend/controllers"
    "backend/middleware"
    "github.com/gin-contrib/cors"
)

func main() {
    config.ConnectDB()

    router := gin.Default()

    // ✅ Enable CORS (very permissive for development)
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, // Your Vite dev server
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    //  Public routes
    router.POST("/register", controllers.Register)
    router.POST("/login", controllers.Login)
    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    //  Debug-only route: crawling example.com
    router.GET("/crawl", func(c *gin.Context) {
        result, err := crawler.Crawl("https://example.com")
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        c.JSON(200, result)
    })

    // Protected routes
    protected := router.Group("/")
    protected.Use(middleware.JWTAuthMiddleware())
    {
        routes.RegisterURLRoutes(protected)
    }

    router.Run(":8080")
}
