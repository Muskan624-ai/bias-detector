# Media Bias Detector
-A machine learning project to identify political and media bias.  
-**Current Goal: Prove the text goes in, the model detects bias and the results are shown.**  

# Project Status  
-**Data**: CSV Cleaned (3,600 Rows)  
-**ML (NLP)**: Model Completed (Fine-tuned DistilBERT with a Validation Loss of 0.0001)   
-**Backend**: Developed FastAPI with 'Mock' Model, (IN PROGRESS)  
-**Frontend**: Designing UI with 'Mock' Data (IN PROGRESS)  
-**Validation**: Creating "Secret Test Set" for Audit (IN PROGRESS)  

# Datasets
https://huggingface.co/datasets/mediabiasgroup/BABE

https://huggingface.co/datasets/fairxllm/allsides-8values

https://huggingface.co/datasets/allenai/social_bias_frames

https://uclanlp.github.io/corefBias/overview?utm_source=chatgpt.com

# Model Weights  
Can be downloaded from here: https://drive.google.com/file/d/11qemBugvaxTAtzhFMQtjE-LHFpl7EJNo/view?usp=sharing

# Installation
To run this project locally, install the dependencies:

```bash
pip install -r requirements.txt

```

# Backend Progress (Latest Work)

- Backend repository structure finalized and cleaned
- Main backend logic updated in `main.py`
- FastAPI backend fully connected with DistilBERT model
- Integrated SHAP-based explainability for prediction reasoning
- Backend API tested successfully using FastAPI Swagger docs
- Backend now returns bias prediction, confidence score, and explanation
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

## Setup Instructions

### 1. Install Requirements

```bash
pip install -r requirements.txt


## How to Run the Project

### Step 1: Clone the Repository

```bash
git clone <repository-link>
cd Bias-detector
```

---

### Step 2: Install Dependencies

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
uvicorn main:app --reload
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
streamlit run app.py
```

Frontend runs on:

```text
http://localhost:8501
```

---

## Important

Both frontend and backend must run **simultaneously**.

Run:

### Terminal 1
```bash
cd Backend
uvicorn main:app --reload
```

### Terminal 2
```bash
streamlit run app.py
```

Otherwise, the frontend will show:

```text
Backend connection failed
```
