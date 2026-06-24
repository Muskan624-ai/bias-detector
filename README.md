# Media Bias Detector
-A machine learning project to identify political and media bias.  
-**Current Goal: Prove the text goes in, the model detects bias and the results are shown.**  

# Datasets
https://huggingface.co/datasets/mediabiasgroup/BABE

https://huggingface.co/datasets/fairxllm/allsides-8values

https://huggingface.co/datasets/allenai/social_bias_frames

https://uclanlp.github.io/corefBias/overview?utm_source=chatgpt.com

# Model Weights  
Can be downloaded from here: 
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

# Frontend (Latest Work)

Frontend application for the Bias Detector project built using React and Vite.

## Features

* Text analysis interface
* Bias detection results page
* Confidence score visualization
* Animated neural network background
* Smooth page transitions
* Responsive user interface
* Modern AI-inspired design

## Tech Stack

* React
* Vite
* Framer Motion
* JavaScript
* HTML5 Canvas
* CSS3

## Project Structure

```text
src/
├── App.jsx
├── LandingPage.jsx
├── AnalysisPage.jsx
├── ResultsPage.jsx
├── LobeCanvas.jsx
├── ConfidenceBar.jsx
├── biasApi.js
├── main.jsx
└── index.css
```

## Installation

```bash
git clone <repository-url>
cd frontend
npm install
```

## Running the Project

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Backend Connection

Update the API endpoint in:

```text
src/biasApi.js
```

to connect with the FastAPI backend.
