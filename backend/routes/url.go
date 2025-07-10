package routes

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "backend/config"
    "backend/models"
)

func RegisterURLRoutes(router *gin.Engine) {
    urlRoutes := router.Group("/urls")
    {
        urlRoutes.POST("/", createURL)
        urlRoutes.GET("/", getURLs)
    }
}

func createURL(c *gin.Context) {
    var url models.URL

    if err := c.ShouldBindJSON(&url); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    url.Status = "queued" // default status
    result := config.DB.Create(&url)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusCreated, url)
}

func getURLs(c *gin.Context) {
    var urls []models.URL
    result := config.DB.Find(&urls)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, urls)
}
