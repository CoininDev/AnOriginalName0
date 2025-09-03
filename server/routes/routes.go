package routes

import (
	"github.com/CoininDev/anoriginalname0/controller"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	otc := &controller.OgTextController{DB: db}
	r.POST("/original", otc.CreateOgText)
	r.GET("/compare", otc.CompareText)
	r.POST("/compare", otc.CompareFeed)
}
