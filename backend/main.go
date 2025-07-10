package main

import (
    "github.com/gin-gonic/gin"
	"backend/config" 
	"backend/routes"
)

func main() {
	config.ConnectDB() 

    router := gin.Default()

    routes.RegisterURLRoutes(router)

    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    router.Run(":8080")
}
