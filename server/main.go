package main

import (
	"os"

	"github.com/joho/godotenv"

	"github.com/CoininDev/anoriginalname0/config"
	"github.com/CoininDev/anoriginalname0/routes"
	"github.com/gin-gonic/gin"
)

func init() {
	godotenv.Load(".env")
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	db := config.ConnectDatabase(dsn)
	router := gin.Default()
	routes.SetupRoutes(router, db)
	router.Run(":6868")
}