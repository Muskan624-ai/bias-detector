# Media Bias Detector
-A machine learning project to identify political and media bias.  
-**Current Goal: Prove the text goes in, the model detects bias and the results are shown.**  

# Datasets
https://huggingface.co/datasets/mediabiasgroup/BABE

https://huggingface.co/datasets/fairxllm/allsides-8values

https://huggingface.co/datasets/allenai/social_bias_frames

https://uclanlp.github.io/corefBias/overview?utm_source=chatgpt.com

# Model Weights  
Can be downloaded from here: https://drive.google.com/drive/u/0/folders/1zY3jNMk23CEe2QrCC5LXmGA1AhMu5zIg

# Backend Progress (Latest Work)

- Backend repository structure finalized and cleaned
- Main backend logic updated in `main.py`
- FastAPI backend fully connected with transformer-based NLP model
- Integrated SHAP-based explainability for prediction reasoning
- Migrated from binary classification to multiclass bias detection
  
- Added support for:
  - Neutral
  - Political Bias
  - Gender Bias
  - Racial Bias
    
- Backend API tested successfully using FastAPI Swagger docs

- Backend now returns:
  - bias prediction
  - predicted bias category
  - confidence score
  - SHAP explanation text

- Multiple model versions tested and integrated successfully
- Project structure stabilized for continued development

# Bias Detector Frontend

Frontend interface for the **Bias Detector** project.

This frontend allows users to paste text (articles, job descriptions, or statements) and send it to the backend model for **bias analysis**.

The goal of this frontend is to provide an easy testing environment so team members can quickly evaluate model predictions without manually running scripts locally.

---

## Features

- Clean and interactive UI
- Paste any text for analysis
- Real-time backend integration
- Displays:
  - Bias Type
  - Confidence Score
  - Model Prediction Label
- User-friendly testing environment

---

## Tech Stack

### Frontend
- Python
- Streamlit

### Backend Connection
- FastAPI API integration
- Requests library

---

## How It Works

1. User enters text in the input box.
2. Frontend sends request to backend API.
3. Backend model processes the text.
4. Prediction result is displayed on screen.

---

## Setup Instructions to run project locally 

### Step 1: Clone the Repository

```bash
git clone <repository-link>
cd Bias-detector
```

### Step 2: Install Dependencies

Create Virtual Environment
```bash
.venv\Scripts\activate
```

Install required Python libraries:

```bash
pip install -r requirements.txt
```

---

### Step 3: Install Git LFS (Required for Model File)

Since the model file is large, install Git LFS.

```bash
git lfs install
git lfs pull
```

This downloads the trained model (`model.safetensors`).

---

### Step 4: Run Backend

Open terminal inside project folder:

```bash
cd Backend
python -m uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

Keep this terminal running.

---

### Step 5: Run Frontend

Open a **new terminal** and go to project folder:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Important

Both frontend and backend must run **simultaneously**.
