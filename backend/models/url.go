package models

import "gorm.io/gorm"

type URL struct {
    gorm.Model
    Link             string `gorm:"not null;unique"`
    HTMLVersion      string
    Title            string
    H1Count          int
    H2Count          int
    H3Count          int
    H4Count          int
    H5Count          int
    H6Count          int
    InternalLinks    int
    ExternalLinks    int
    BrokenLinks      int
    HasLoginForm     bool
    Status           string `gorm:"type:varchar(20);default:'queued'"` 
}
