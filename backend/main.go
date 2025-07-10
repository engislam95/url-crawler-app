package main

import (
    "github.com/gin-gonic/gin"
	"backend/config" 
	"backend/routes"
	"backend/crawler"
)

func main() {
	config.ConnectDB() 

    router := gin.Default()

    routes.RegisterURLRoutes(router)

	// Test ping
	
    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

	//  test endpoint
    router.GET("/crawl", func(c *gin.Context) {
        result, err := crawler.Crawl("https://example.com")
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        c.JSON(200, result)
    })

    router.Run(":8080")
}
