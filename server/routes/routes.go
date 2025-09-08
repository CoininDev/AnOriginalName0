package routes

import (
	"github.com/CoininDev/anoriginalname0/controller"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	otc := &controller.OgTextController{DB: db}

	/// Original just post the text to the db
	r.POST("/original", otc.CreateOgText)

	/// Compare get the text from the db and compare it to the input text
	/// This does not store anything in the db
	r.GET("/compare", otc.CompareText)

	/// Compare get the text from the db and compare it to the input text
	/// This stores the comparison result in the db
	/// Returns identically structured response as GET /compare
	r.POST("/compare", otc.CompareFeed)
}
