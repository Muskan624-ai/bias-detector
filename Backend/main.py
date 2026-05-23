from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import shap

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
    model="Backend/model",
    tokenizer="Backend/model"
)

shap_explainer = shap.Explainer(classifier)

# Input schema
class InputText(BaseModel):
    text: str

# API route
@app.post("/predict")
def predict(data: InputText):
    result = classifier(data.text)

    label = result[0]["label"]
    readable_label = "biased" if label == "LABEL_1" else "not_biased"
    score = result[0]["score"]

    try:
        shap_values = shap_explainer([data.text])
        tokens = shap_values[0].data
        importances = shap_values[0].values

        important_words = []

        for token, score_array in zip(tokens, importances):
            if len(score_array) > 1 and score_array[1] > 0.01:
                clean_token = token.strip().replace("Ġ", "")
                if len(clean_token) > 1:
                    important_words.append(clean_token)

        important_words = list(set(important_words))

        if label == "LABEL_1" and important_words:
            explanation = "Top linguistic drivers detected: " + ", ".join(important_words)
        elif label == "LABEL_1":
            explanation = "The model detected bias based on the overall context and wording."
        else:
            explanation = "The text appears neutral based on the model prediction."

    except Exception:
        explanation = "Explanation could not be generated for this input."

    return {
        "is_biased": label == "LABEL_1",
        "confidence": f"{round(score * 100, 2)}%",
        "label": readable_label,
        "explanation": explanation
    }