package model

import (
	"github.com/pgvector/pgvector-go"
)

type OgText struct {
	ID        uint `gorm:"primaryKey"`
	Text      string
	Embedding pgvector.Vector `gorm:"type:vector(384)"`
}
