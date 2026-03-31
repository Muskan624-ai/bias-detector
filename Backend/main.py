from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# input format
class TextInput(BaseModel):
    text: str

# route
@app.post("/predict")
def predict(data: TextInput):
    return {
        "is_biased": True,
        "confidence": 0.95
    }