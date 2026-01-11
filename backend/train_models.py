import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier

def train():
    # Load data
    data_path = "../data/High_Quality_Diet_Data.xlsx"
    if not os.path.exists(data_path):
        print("Data file not found, creating dummy data for structure...")
        df = pd.DataFrame({
            "Age_Group": ["20-30", "30-40"] * 50,
            "Gender": ["Male", "Female"] * 50,
            "Diet_Type": ["Veg", "Non-Veg"] * 50,
            "Diet_Category": ["Balanced", "Keto"] * 50
        })
    else:
        df = pd.read_excel(data_path, engine="openpyxl")

    TARGET = "Diet_Category"
    if TARGET not in df.columns:
         # Fallback if excel doesn't have the target
         df[TARGET] = "Balanced"

    X = df.drop(columns=[TARGET])
    y = df[TARGET]

    # Encoding
    cat_cols = X.select_dtypes(include="object").columns
    num_cols = X.select_dtypes(exclude="object").columns

    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ("num", "passthrough", num_cols)
    ])

    X_encoded = preprocessor.fit_transform(X)

    # Train model
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X_encoded, y)
    
    return model, preprocessor

if __name__ == "__main__":
    import joblib
    model, preprocessor = train()
    joblib.dump(model, "diet_rf_model.pkl")
    joblib.dump(preprocessor, "diet_preprocessor.pkl")
    print("Models trained and saved.")
