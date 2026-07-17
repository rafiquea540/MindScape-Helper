# sentiment_analysis_api.py
from flask import Flask, request, jsonify
from transformers import pipeline
from deepface import DeepFace
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Initialize Hugging Face Sentiment Analysis Pipeline
sentiment_analysis = pipeline('sentiment-analysis')

# Sentiment Analysis Endpoint
@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    text = request.json.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    sentiment = sentiment_analysis(text)[0]
    return jsonify({'label': sentiment['label'], 'score': sentiment['score']}), 200

# Emotion Analysis Endpoint
@app.route('/analyze-emotion', methods=['POST'])
def analyze_emotion():
    if 'file' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['file']
    image = np.array(Image.open(io.BytesIO(file.read())))

    try:
        analysis = DeepFace.analyze(image, actions=['emotion'])
        return jsonify(analysis), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
