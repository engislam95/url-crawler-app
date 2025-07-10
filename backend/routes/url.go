package routes

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "backend/config"
    "backend/models"
	"backend/crawler"
)


func RegisterURLRoutes(router gin.IRoutes) {
	router.POST("/urls", createURL)
	router.GET("/urls", getURLs)
	router.GET("/urls/:id", getURLByID)
	router.DELETE("/urls/:id", deleteURL)
}

func createURL(c *gin.Context) {
	var input struct {
		Link string `json:"Link" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var url models.URL
	result := config.DB.Where("link = ?", input.Link).First(&url)

	if result.RowsAffected > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "URL already exists", "data": url})
		return
	}

	// Save as queued
	url = models.URL{
		Link:   input.Link,
		Status: "queued",
	}
	if err := config.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Start crawling in background
	go func(u models.URL) {
		// Set status = running
		config.DB.Model(&u).Update("Status", "running")

		crawlResult, err := crawler.Crawl(u.Link)
		if err != nil {
			config.DB.Model(&u).Update("Status", "error")
			return
		}

		// Update with crawl results
		config.DB.Model(&u).Updates(models.URL{
			HTMLVersion:   crawlResult.HTMLVersion,
			Title:         crawlResult.Title,
			H1Count:       crawlResult.Headings["H1"],
			H2Count:       crawlResult.Headings["H2"],
			H3Count:       crawlResult.Headings["H3"],
			H4Count:       crawlResult.Headings["H4"],
			H5Count:       crawlResult.Headings["H5"],
			H6Count:       crawlResult.Headings["H6"],
			InternalLinks: crawlResult.InternalLinks,
			ExternalLinks: crawlResult.ExternalLinks,
			BrokenLinks:   crawlResult.BrokenLinks,
			HasLoginForm:  crawlResult.HasLoginForm,
			Status:        "done",
		})
	}(url)

	// Return accepted
	c.JSON(http.StatusAccepted, gin.H{"message": "Crawl started", "data": url})
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


func getURLByID(c *gin.Context) {
    id := c.Param("id")

    var url models.URL
    result := config.DB.First(&url, id)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
        return
    }

    c.JSON(http.StatusOK, url)
}

func deleteURL(c *gin.Context) {
	id := c.Param("id")

	var url models.URL
	result := config.DB.First(&url, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	if err := config.DB.Delete(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete URL"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "URL deleted successfully"})
}

