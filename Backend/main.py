from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from fastapi.middleware.cors import CORSMiddleware
import shap

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = {
    "LABEL_0": "Neutral",
    "LABEL_1": "Political Bias",
    "LABEL_2": "Gender Bias",
    "LABEL_3": "Racial Bias"
}

<<<<<<< HEAD
MODEL_PATH = "./model"
=======
MODEL_PATH = "./model"
>>>>>>> 60c2e56 (Improve bias detection model integration)

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

classifier = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    return_all_scores=True,
    device=-1
)

shap_explainer = shap.Explainer(classifier)

class InputText(BaseModel):
    text: str

@app.post("/predict")
def predict(data: InputText):
    all_predictions = classifier(data.text, top_k=None)

    if isinstance(all_predictions[0], list):
        all_predictions = all_predictions[0]

    winning_prediction = max(all_predictions, key=lambda x: x["score"])
    raw_label = winning_prediction["label"]
    confidence_score = winning_prediction["score"]

    readable_label = CLASS_NAMES.get(raw_label, "Unknown")
    is_biased = raw_label != "LABEL_0"

    try:
        class_idx = int(raw_label.split("_")[-1])

        shap_values = shap_explainer([data.text])
        tokens = shap_values[0].data
        importances = shap_values[0].values[:, class_idx]

        important_words = []

        for token, token_importance in zip(tokens, importances):
            if token_importance > 0.01:
                clean_token = token.strip().replace("Ġ", "").replace("##", "")
                if len(clean_token) > 1:
                    important_words.append(clean_token)

        important_words = list(dict.fromkeys(important_words))

        if is_biased and important_words:
            explanation = f"Detected {readable_label}. Top linguistic drivers: " + ", ".join(important_words)
        elif is_biased:
            explanation = f"The model detected elements of {readable_label} based on overall contextual structure."
        else:
            explanation = "The text patterns align with objective, neutral speech."

    except Exception:
        explanation = "Classification complete, but deep metric explanation is unavailable for this specific text."

    return {
        "is_biased": is_biased,
        "confidence": f"{round(confidence_score * 100, 2)}%",
        "label": readable_label,
        "explanation": explanation
    }
