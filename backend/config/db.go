package config

import (
    "fmt"
    "log"

    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "backend/models"
)

var DB *gorm.DB

func ConnectDB() {
    dsn := "root:123456@tcp(127.0.0.1:3306)/webcrawler?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("❌ Failed to connect to database:", err)
    }

    fmt.Println("✅ Connected to MySQL database successfully")
    DB = db

    db.AutoMigrate(&models.URL{})

}
