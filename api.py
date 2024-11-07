import io
from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
import numpy as np
import joblib
import os
import cv2
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_image(image, target_size):
    """
    Prétraitement d'une image en niveaux de gris à partir d'un fichier.
    Args:
    - image: image à traiter.
    - target_size (tuple): La taille cible de l'image redimensionnée.
    Returns:
    - image_array: Image prétraitée et aplatie.
    """
    # Convertir l'image en niveaux de gris si nécessaire
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.IMREAD_GRAYSCALE)
    
    # Redimensionner l'image
    resized_image = cv2.resize(image, target_size)
    
    # Normaliser les valeurs de pixel pour les ramener à une échelle commune (0 à 1)
    normalized_image = resized_image / 255.0
    
    # Aplatir l'image
    flattened_image = normalized_image.flatten()
    
    return flattened_image

def load_model(model_name):
    model_path = f'model_{model_name}.pkl'
    if os.path.exists(model_path):
        data = joblib.load(model_path)
        # Ensure the 'pca' key exists in the loaded data
        model = data['model']
        scaler = data['scaler']
        pca = data.get('pca', None)
        classification_report = data['classification_report']
        return model, scaler, pca, classification_report
    else:
        raise ValueError(f"Model '{model_name}' not found")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if 'model' not in request.form:
        return jsonify({'error': 'No model parameter'})

    model_name = request.form['model']
    
    if file:
        try:
            image = Image.open(io.BytesIO(file.read()))
            
            # Save the uploaded image
            image_path = os.path.join(UPLOAD_FOLDER, file.filename)
            image.save(image_path)

            image_cv = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            # Prétraitement de l'image
            if model_name == 'sgd':
                target_size = (150, 150)
            elif model_name == 'svm':
                target_size = (64, 64)
            else:
                target_size = (100, 100)
                
            image_array = preprocess_image(image_cv, target_size).reshape(1, -1)
            model, scaler, pca, classification_report = load_model(model_name)

            # Apply scaling and PCA
            scaled_image = scaler.transform(image_array)

            if model_name == 'sgd':
                transformed_image = pca.transform(scaled_image)
            else:
                transformed_image = scaled_image
            
            prediction = model.predict(transformed_image)
            probabilities = model.predict_proba(transformed_image)[0]

            if model_name == 'lr':
                prediction = int(prediction[0])
                probabilities = probabilities.tolist()
            else:
                prediction = np.array(prediction).tolist()
                probabilities = np.array(probabilities).tolist()
        
            return jsonify({
                'model': model_name,
                'prediction': prediction,
                'probabilities': probabilities,
                'classification_report': classification_report,
                'image_url': f'/uploads/{file.filename}'  # URL to access the saved image
            })
        except Exception as e:
            print(e)
            return jsonify({'error': str(e)})

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3001)
