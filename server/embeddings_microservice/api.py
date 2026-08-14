import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")

origins = [
    os.getenv("BACKEND_URL", "http://localhost:6868"),
]

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 6969))
    uvicorn.run(app, host="0.0.0.0", port=port)