#!/bin/bash

cd ./server/embeddings_microservice
uvicorn api:app --reload --port 6969