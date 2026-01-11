import requests
import json

url = "http://127.0.0.1:5000/predict"
# Payload mocking what the frontend sends
data = {
    "Age_Group": "30-40",
    "Gender": "Female",
    "Diet_Type": "Veg", # Frontend sends Veg for Vegan
    "Skin_Type": "Normal",
    "Skin_Issue": "Acne",
    "Trust_in_AI": 3,
    "Ayurveda_Awareness": 5,
    "Product_Type_Used": "Chemical",
    "Hair_Type": "Straight",
    "Hair_Issue": "None",
    "Diet_Quality": "Average"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print("Response Text:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
