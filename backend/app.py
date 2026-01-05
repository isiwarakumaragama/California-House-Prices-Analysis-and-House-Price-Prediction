from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import statsmodels.api as sm
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Load the model
try:
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "california_model.pkl")
    model = joblib.load(model_path)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

@app.route("/")
def home():
    """Home endpoint that provides API information and usage instructions."""
    return jsonify({
        "message": "California House Price Predictor API is running!",
        "version": "1.0.0",
        "endpoints": {
            "/": "GET - Show this information",
            "/predict": "POST - Predict house price based on features"
        },
        "prediction_endpoint_docs": {
            "url": "/predict",
            "method": "POST",
            "content_type": "application/json",
            "required_fields": {
                "longitude": "float (-124 to -114)",
                "latitude": "float (32 to 42)",
                "housing_median_age": "float (0 to 100)",
                "total_rooms": "float (positive)",
                "population": "float (positive)",
                "households": "float (positive)",
                "median_income": "float (positive)",
                "ocean_proximity_<1H OCEAN": "binary (0 or 1)",
                "ocean_proximity_INLAND": "binary (0 or 1)",
                "ocean_proximity_NEAR BAY": "binary (0 or 1)",
                "ocean_proximity_NEAR OCEAN": "binary (0 or 1)"
            },
            "notes": [
                "Exactly one ocean_proximity field must be 1, others 0",
                "All fields are required",
                "Response will include predicted price in USD"
            ]
        }
    })

def validate_input(data):
    required_fields = [
        "longitude", "latitude", "housing_median_age", "total_rooms",
        "population", "households", "median_income",
        "ocean_proximity_<1H OCEAN", "ocean_proximity_INLAND",
        "ocean_proximity_NEAR BAY", "ocean_proximity_NEAR OCEAN"
    ]
    
    # Check if all required fields are present
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
    
    # Validate data types and ranges
    try:
        longitude = float(data["longitude"])
        latitude = float(data["latitude"])
        housing_median_age = float(data["housing_median_age"])
        total_rooms = float(data["total_rooms"])
        population = float(data["population"])
        households = float(data["households"])
        median_income = float(data["median_income"])
        
        # Validate ranges
        if not (-124 <= longitude <= -114):  # California longitude range
            raise ValueError("Longitude must be between -124 and -114")
        if not (32 <= latitude <= 42):  # California latitude range
            raise ValueError("Latitude must be between 32 and 42")
        if not (0 <= housing_median_age <= 100):
            raise ValueError("Housing median age must be between 0 and 100")
        if not (0 <= total_rooms):
            raise ValueError("Total rooms must be positive")
        if not (0 <= population):
            raise ValueError("Population must be positive")
        if not (0 <= households):
            raise ValueError("Households must be positive")
        if not (0 <= median_income):
            raise ValueError("Median income must be positive")
        
        # Validate ocean proximity one-hot encoding
        ocean_proximity_fields = [
            "ocean_proximity_<1H OCEAN",
            "ocean_proximity_INLAND",
            "ocean_proximity_NEAR BAY",
            "ocean_proximity_NEAR OCEAN"
        ]
        ocean_values = [int(data[field]) for field in ocean_proximity_fields]
        if not all(v in [0, 1] for v in ocean_values):
            raise ValueError("Ocean proximity fields must be 0 or 1")
        if sum(ocean_values) != 1:
            raise ValueError("Exactly one ocean proximity field must be 1")
            
        return [longitude, latitude, housing_median_age, total_rooms,
                population, households, median_income] + ocean_values
                
    except ValueError as e:
        raise ValueError(f"Invalid input data: {str(e)}")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 503
        
    try:
        # Validate request content type
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.json
        features = validate_input(data)
        
        # Define feature names in the correct order
        feature_names = [
            "longitude", "latitude", "housing_median_age", "total_rooms",
            "population", "households", "median_income",
            "ocean_proximity_<1H OCEAN", "ocean_proximity_INLAND",
            "ocean_proximity_NEAR BAY", "ocean_proximity_NEAR OCEAN"
        ]
        
        # Convert to DataFrame with proper column names (model was trained with named features)
        features_df = pd.DataFrame([features], columns=feature_names)

        prediction = model.predict(features_df)[0][0]
        return jsonify({
            "status": "success",
            "predicted_price": round(float(prediction), 2),
            "units": "USD"
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Prediction error: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
