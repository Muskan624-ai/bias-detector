from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
classifier = pipeline(
    "text-classification",
    model="./model",
    tokenizer="./model"
)

# Input schema
class InputText(BaseModel):
    text: str

# API route
@app.post("/predict")
def predict(data: InputText):
    result = classifier(data.text)

    label = result[0]['label']
    score = result[0]['score']

    return {
        "is_biased": label == "LABEL_1",
        "confidence": f"{round(score * 100, 2)}%",
        "label": label
    }