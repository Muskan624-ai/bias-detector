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
    model="./model",
    tokenizer="./model"
)

shap_explainer = shap.Explainer(classifier)

# Input schema
class InputText(BaseModel):
    text: str

# API route
@app.post("/predict")
def predict(data: InputText):
    result = classifier(data.text)

    raw_label = result[0]["label"]
    score = result[0]["score"]

    # IMPORTANT:
    # For this model, LABEL_0 = biased and LABEL_1 = not_biased
    is_biased = raw_label == "LABEL_0"
    readable_label = "biased" if is_biased else "not_biased"

    try:
        shap_values = shap_explainer([data.text])
        tokens = shap_values[0].data
        importances = shap_values[0].values

        important_words = []

        for token, score_array in zip(tokens, importances):
            # Use LABEL_0 index because LABEL_0 means biased for this model
            if len(score_array) > 0 and score_array[0] > 0.01:
                clean_token = token.strip().replace("Ġ", "")
                if len(clean_token) > 1:
                    important_words.append(clean_token)

        important_words = list(set(important_words))

        if is_biased and important_words:
            explanation = "Top linguistic drivers detected: " + ", ".join(important_words)
        elif is_biased:
            explanation = "The model detected bias based on the overall context and wording."
        else:
            explanation = "The text appears neutral based on the model prediction."

    except Exception:
        explanation = "Explanation could not be generated for this input."

    return {
        "is_biased": is_biased,
        "confidence": f"{round(score * 100, 2)}%",
        "label": readable_label,
        "explanation": explanation
    }
