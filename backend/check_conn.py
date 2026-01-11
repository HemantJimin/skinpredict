import requests

try:
    print("Testing Backend Connectivity on Port 5000...")
    response = requests.get("http://localhost:5000/")
    if response.status_code == 200:
        print("SUCCESS: Backend is reachable.")
        print("Response:", response.text)
    else:
        print(f"FAILED: Backend returned status {response.status_code}")
except Exception as e:
    print(f"FAILED: Could not connect to backend. Error: {e}")
