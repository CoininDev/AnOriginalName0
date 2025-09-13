package main

import (
	"os"

	"github.com/joho/godotenv"

	"github.com/CoininDev/anoriginalname0/config"
	"github.com/CoininDev/anoriginalname0/routes"
	"github.com/gin-gonic/gin"

	//"time"

	"github.com/gin-contrib/cors"
)

func init() {
	godotenv.Load(".env")
}

func main() {

	dsn := os.Getenv("DATABASE_URL")
	db := config.ConnectDatabase(dsn)
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: false,
	}))

	routes.SetupRoutes(router, db)
	router.Run(":6868")
}
