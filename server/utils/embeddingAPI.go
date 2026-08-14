package utils

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type EmbeddingResponse struct {
	Embedding []float32
	Length    uint
}

func EmbeddingAPI(text string) EmbeddingResponse {
	embeddingURL := os.Getenv("EMBEDDING_SERVICE_URL")
	resp, err := http.Post(embeddingURL, "text/plain", bytes.NewBufferString(text))
	if err != nil {
		log.Panicf("EmbeddingAPI não disponível (esqueceu de ligar?)\n\"%v\"", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var result EmbeddingResponse
	if err := json.Unmarshal(body, &result); err != nil {
		log.Panicf("Erro ao decodificar JSON: %v", err)
	}

	return result
}
