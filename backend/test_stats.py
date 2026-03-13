import requests

res = requests.post("http://127.0.0.1:8000/api/v1/auth/login", json={"govt_id": "ADMIN-001", "pin": "1234"})
token = res.json().get("access_token")
print(f"Token acquired: {token[:10]}...")

stats_res = requests.get("http://127.0.0.1:8000/api/v1/stats/admin", headers={"Authorization": f"Bearer {token}"})
print(f"Status Code: {stats_res.status_code}")
print(f"Response: {stats_res.text}")
