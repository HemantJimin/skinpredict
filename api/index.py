import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

from recommendation_engine import (
    predict_skin_problem,
    deduce_skin_condition,
    recommend_foods,
    select_treatment_method,
    lifestyle_actions,
    product_composition
)

# -----------------------------------
# App Initialization
# -----------------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------------
# Load ML Model & Preprocessor
# -----------------------------------
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
model = joblib.load(os.path.join(backend_path, "diet_rf_model.pkl"))
preprocessor = joblib.load(os.path.join(backend_path, "diet_preprocessor.pkl"))

# -----------------------------------
# Normalize Input
# -----------------------------------
def normalize_input(data):
    out = {}
    for k, v in data.items():
        if isinstance(v, str):
            out[k] = v.strip().title()
        else:
            out[k] = v
    return out

# -----------------------------------
# Routes
# -----------------------------------

@app.route("/")
def home():
    return jsonify({"message": "Skin Health Recommendation API is running on Vercel!"})


@app.route("/api/predict", methods=["POST"])
def predict():
    # 1. Read & normalize input
    data = normalize_input(request.json)

    # 2. Ensure ALL expected columns exist
    expected_cols = list(preprocessor.feature_names_in_)
    for col in expected_cols:
        if col not in data:
            data[col] = 3 if col in ["Ayurveda_Awareness", "Trust_in_AI"] else "None"

    # 3. Create DataFrame with correct order
    input_df = pd.DataFrame([data])
    input_df = input_df.reindex(columns=expected_cols)

    # 4. ML Prediction
    X_encoded = preprocessor.transform(input_df)
    diet_category = model.predict(X_encoded)[0]

    # -----------------------------------
    # SAFETY & LOGIC OVERRIDES (CRITICAL)
    # -----------------------------------

    # Vegan should not get Keto
    if diet_category == "Keto" and data["Diet_Type"] == "Vegan":
        diet_category = "Anti-inflammatory Vegan"

    # Elderly should not get Keto
    if data["Age_Group"] in ["66-75", "76+"] and diet_category == "Keto":
        diet_category = "Balanced / Anti-inflammatory"

    # 5. Rule-based logic
    skin_problem = predict_skin_problem(
        data["Skin_Type"],
        data["Skin_Issue"]
    )

    skin_condition = deduce_skin_condition(skin_problem)

    foods, foods_to_avoid = recommend_foods(skin_problem)

    treatment_method = select_treatment_method(
        data["Trust_in_AI"],
        data["Ayurveda_Awareness"]
    )

    lifestyle = lifestyle_actions()

    composition = product_composition(
        data["Ayurveda_Awareness"],
        data["Product_Type_Used"]
    )

    # 6. Final Response
    response = {
        "Diagnosis": skin_condition,
        "Recommended_Diet": diet_category,
        "Treatment_Method": treatment_method,
        "Recommended_Product_Composition": composition,
        "Superfoods_For_You": foods,
        "Foods_To_Avoid": foods_to_avoid,
        "Daily_Actions": lifestyle
    }

    return jsonify(response)


# Vercel expects the app to be exported
if __name__ == "__main__":
    app.run()
