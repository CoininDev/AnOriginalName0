package controller

import (
	"math"
	"net/http"

	"github.com/CoininDev/anoriginalname0/model"
	"github.com/CoininDev/anoriginalname0/utils"
	"github.com/gin-gonic/gin"
	"github.com/pgvector/pgvector-go"
	"gorm.io/gorm"
)

const ANN_QUERY = `
SELECT id, text, embedding <=> ? AS distance
FROM og_texts
ORDER BY embedding <=> ?
LIMIT 20;
`
const TOP_K = 3
const ALPHA = 5

type OgTextController struct {
	DB *gorm.DB
}

type CreateOgTextRequest struct {
	Text string `json:"text"`
}

func Originality(distances []float64, alpha float64) float64 {
	originality := 1.0
	for _, d := range distances {
		originality *= (1 - math.Exp(-alpha*d))
	}
	return originality
}

func (otc *OgTextController) CreateOgText(c *gin.Context) {
	var req CreateOgTextRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	emb := utils.EmbeddingAPI(req.Text)

	ogtext := model.OgText{
		Text:      req.Text,
		Embedding: pgvector.NewVector(emb.Embedding),
	}

	if err := otc.DB.Create(&ogtext).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ogtext)
}

type SearchResult struct {
	ID       uint
	Text     string
	Distance float32
}

func (otc *OgTextController) CompareText(c *gin.Context) {
	var req CreateOgTextRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	emb := utils.EmbeddingAPI(req.Text)

	var results []struct {
		ID       uint
		Text     string
		Distance float32
	}

	vec := pgvector.NewVector(emb.Embedding)
	// consulta ANN no pgvector
	otc.DB.Raw(ANN_QUERY, vec, vec).Scan(&results)

	if len(results) <= 0 {
		c.JSON(http.StatusOK, gin.H{
			"text":         req.Text,
			"originality":  1.0,
			"most_similar": nil,
		})
		return
	}

	var dists []float64
	for _, res := range results {
		dists = append(dists, float64(res.Distance))
	}
	originality := Originality(dists, ALPHA)
	orgyF32 := float32(originality)

	topK := results
	if len(topK) > TOP_K {
		topK = topK[:TOP_K]
	}

	c.JSON(http.StatusOK, gin.H{
		"text":         req.Text,
		"originality":  orgyF32,
		"most_similar": topK,
	})
}

func (otc *OgTextController) CompareFeed(c *gin.Context) {
	var req CreateOgTextRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	emb := utils.EmbeddingAPI(req.Text)

	ogtext := model.OgText{
		Text:      req.Text,
		Embedding: pgvector.NewVector(emb.Embedding),
	}

	vec := pgvector.NewVector(emb.Embedding)
	var results []struct {
		ID       uint
		Text     string
		Distance float32
	}
	otc.DB.Raw(ANN_QUERY, vec, vec).Scan(&results)

	otc.DB.Create(&ogtext)

	if len(results) <= 0 {
		c.JSON(http.StatusOK, gin.H{
			"text":         req.Text,
			"originality":  float32(1.0),
			"most_similar": nil,
		})
		return
	}

	var dists []float64
	for _, res := range results {
		dists = append(dists, float64(res.Distance))
	}
	originality := Originality(dists, ALPHA)
	orgyF32 := float32(originality)

	topK := results
	if len(topK) > TOP_K {
		topK = topK[:TOP_K]
	}

	c.JSON(http.StatusOK, gin.H{
		"text":         req.Text,
		"originality":  orgyF32,
		"most_similar": topK,
	})
}
