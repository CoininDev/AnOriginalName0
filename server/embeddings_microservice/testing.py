from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
sentence = "bobba"
embedding = model.encode(sentence)
print(embedding)