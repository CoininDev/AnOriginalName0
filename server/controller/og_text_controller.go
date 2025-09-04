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
LIMIT 5;
`

type OgTextController struct {
	DB *gorm.DB
}

type CreateOgTextRequest struct {
	Text string `json:"text"`
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
	originality := utils.Mean(dists)
	originality = math.Max(0, math.Min(1, originality))
	orgyF32 := float32(originality)

	c.JSON(http.StatusOK, gin.H{
		"text":         req.Text,
		"originality":  orgyF32,
		"most_similar": results[0],
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

	// Configura a distância máxima para normalização
	const maxDistance = 2.0

	var normDists []float64
	var weights []float64
	zeroDistance := false

	for i, res := range results {
		dist := float64(res.Distance)
		if dist <= 0.000001 {
			zeroDistance = true
		}

		// normaliza a distância
		normDist := dist / maxDistance
		if normDist > 1 {
			normDist = 1
		}
		normDists = append(normDists, normDist)

		// pesos decrescentes (ex: vizinho mais próximo tem peso maior)
		// aqui usei 1/(i+1), mas você pode ajustar
		weights = append(weights, 1.0/float64(i+1))
	}

	var originality float64
	if zeroDistance {
		originality = 0.0
	} else {
		weightedSum := 0.0
		weightTotal := 0.0
		for i := range normDists {
			weightedSum += normDists[i] * weights[i]
			weightTotal += weights[i]
		}
		originality = 1.0 - (weightedSum / weightTotal)
		if originality < 0 {
			originality = 0
		}
		if originality > 1 {
			originality = 1
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"text":         req.Text,
		"originality":  float32(originality),
		"most_similar": results[0],
	})
}
