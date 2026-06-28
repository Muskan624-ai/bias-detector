# Bias Detector Overview

Bias Detector helps identify biased language in texts and classifies it into one of four categories:
- Neutral 
- Political Bias 
- Gender Bias 
- Racial Bias
  
The system uses a fine-tuned transformer-based classifier trained on a curated dataset collected from multiple bias-related datasets and manually audited for label quality. In addition to prediction, the system provides model explanations using SHAP to highlight which words contributed most to the prediction. 

# Live Demo

Deployed Application: https://bias-detector-gamma.vercel.app/

# Model Weights  

Can be downloaded from here: https://drive.google.com/file/d/1icxCJJqb3KmN-AtS1FYUjWjLwLuey3Cg/view?usp=sharing

# Dataset

The final dataset was created by combining and cleaning samples from multiple publicly available bias-related datasets.

- https://huggingface.co/datasets/mediabiasgroup/BABE (BABE)

- https://huggingface.co/datasets/fairxllm/allsides-8values (AllSides)

- https://huggingface.co/datasets/uclanlp/wino_bias (WinoBias)

- https://huggingface.co/datasets/McGill-NLP/stereoset (StereoSet)

- Additional manually created examples

### Dataset Cleaning

Several rounds of manual auditing were performed to improve dataset quality:

- Removed mislabeled examples
- Removed ambiguous samples
- Removed news-style article excerpts
- Added conversational neutral examples
- Added balanced examples for political, gender, and racial bias
- Corrected label inconsistencies

# Text Preprocessing

The preprocessing pipeline includes:

1. Remove incomplete records by dropping rows with missing text or labels.
2. Convert all text to lowercase.
3. Remove numbers, punctuation marks, and special characters using regular expressions.
4. Normalize whitespace and trim extra spaces.
5. Perform an 80:20 train-test split to preserve the distribution of all four classes.
6. Tokenize text using the DistilBERT tokenizer.
7. Truncate sequences to a maximum length of 128 tokens.
8. Generate attention masks automatically during tokenization.
9. Apply dynamic padding using Hugging Face's `DataCollatorWithPadding` to minimize unnecessary padding during training.

### Label Mapping

| Label | Category       |
| ----- | -------------- |
| 0     | Neutral        |
| 1     | Political Bias |
| 2     | Gender Bias    |
| 3     | Racial Bias    |

# Model Details

## Model Architecture

The project uses **DistilBERT** as the base transformer model.
To address class imbalance, class weights were computed using Scikit-Learn's `compute_class_weight()` function and incorporated into a custom weighted cross-entropy loss function during training which helped reduce bias towards majority classes and improved learning for underrepresented categories.


## Explainability

Model predictions are supplemented with SHAP-based explanations to provide insight into which words or phrases contributed most to a classification decision which helps improves transparency and helps users understand why a particular bias label was assigned.


# Tech Stack

* React
* Vite
* Framer Motion
* JavaScript
* HTML5 Canvas
* CSS3
* FastAPI
* Python
* DistilBERT
* PyTorch
* Hugging Face Transformers
* SHAP
* Pandas
* Scikit-learn
* Uvicorn
* FastAPI CORS Middleware

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
