import requests
res = requests.post("http://127.0.0.1:8000/api/v1/auth/login", json={"govt_id": "ADMIN-001", "pin": "1234"})
print(res.json().get("access_token"))
