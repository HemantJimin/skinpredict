from recommendation_engine import (
    predict_skin_problem,
    deduce_skin_condition,
    recommend_foods,
    select_treatment_method,
    lifestyle_actions,
    calculate_health_scores,
    calculate_product_breakdown
)
import json

def main():
    # Updated User Input based on latest request
    user_input = {
      "Age_Group": "26-35",
      "Gender": "Female",
      "Skin_Type": "Oily",
      "Hair_Type": "Dry",
      "Skin_Issue": "Acne",
      "Hair_Issue": "None",
      "Diet_Type": "Vegetarian",
      "Diet_Quality": "High",
      "Product_Type_Used": "Chemical",
      "Ayurveda_Awareness": 4,
      "Trust_in_AI": 5,
      "Current_Products": "Chemical" # Mapping Product_Type_Used to Current_Products
    }

    print("--- User Input ---")
    print(json.dumps(user_input, indent=2))
    print("\nProcessing...\n")

    # 1. Predict Problem
    skin_problem = predict_skin_problem(user_input["Skin_Type"], user_input["Skin_Issue"])
    
    # 2. Deduce Condition
    condition = deduce_skin_condition(skin_problem)
    
    # 3. Recommendations
    foods, avoid = recommend_foods(skin_problem)
    
    # 4. Treatment
    method = select_treatment_method(user_input["Trust_in_AI"], user_input["Ayurveda_Awareness"])
    
    # 5. Scores (Enhanced to use Diet Quality)
    scores = calculate_health_scores(skin_problem, user_input["Diet_Type"], user_input["Diet_Quality"])
    
    # 6. Product Breakdown
    products = calculate_product_breakdown(
        user_input["Trust_in_AI"], 
        user_input["Ayurveda_Awareness"],
        user_input["Current_Products"]
    )

    result = {
        "Predicted_Skin_Problem": skin_problem,
        "Deduced_Skin_Condition": condition,
        "Recommended_Treatment_Method": method,
        "Analysis_Report": scores,
        "Product_Usage": products,
        "Hair_Analysis": f"Hair Type: {user_input['Hair_Type']} | Issue: {user_input['Hair_Issue']}"
    }

    print("--- Final Recommendation ---")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
