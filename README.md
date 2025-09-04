# An Original Name
This project provides a back-end API that evaluates the originality score of a given text, based on a similarity search against its database.

## Features
- Calculates originality scores in the range `[0,1]` (lower = less original, higher = more original).
- Uses semantic embeddings to compare text similarity.
- Efficient nearest neighbor search with `pgvector`.
- Designed to be easily extendable for other NLP tasks.

## Technologies
- **API**: [Go](https://go.dev/) + [Gin](https://gin-gonic.com/)
- **Text Embeddings**: Python microservice with [sentence-transformers](https://www.sbert.net/) (`all-MiniLM-L6-v2`)
- **Database**: [Supabase](https://supabase.com/) with PostgreSQL + [pgvector](https://github.com/pgvector/pgvector)
- **Search Optimization**: ANN (Approximate Nearest Neighbor) + indexes for fast queries


