from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/embed")
async def embed_text(request: Request):
    txt = await request.body()
    data = txt.decode("utf-8")
    embedding = model.encode(data).tolist()
    return {"embedding": embedding, "length": len(embedding)}