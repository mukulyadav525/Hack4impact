import requests

def test_routes():
    base_url = "http://localhost:8000/api/v1"
    endpoints = [
        "/auth/me",
        "/scoring/rules",
        "/submissions/",
        "/stats/admin"
    ]
    
    for ep in endpoints:
        url = base_url + ep
        try:
            # Try without token first
            res = requests.get(url)
            print(f"GET {url} -> {res.status_code}")
            if res.status_code == 404:
                # Try with trailing slash
                if not url.endswith("/"):
                    url_slash = url + "/"
                    res_slash = requests.get(url_slash)
                    print(f"GET {url_slash} -> {res_slash.status_code}")
        except Exception as e:
            print(f"FAILED {url}: {e}")

if __name__ == "__main__":
    test_routes()
