import sys
import urllib.request
import urllib.error
import ssl
from urllib.parse import urlparse

USAGE = "Usage: python check_https.py <file_with_http_urls>"

# Function to check https support
def supports_https(http_url: str) -> bool:
    parsed = urlparse(http_url.strip())
    if not parsed.scheme:
        http_url = 'http://' + http_url.strip()
        parsed = urlparse(http_url)
    https_url = parsed._replace(scheme='https').geturl()
    ctx = ssl.create_default_context()
    req = urllib.request.Request(https_url, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5, context=ctx) as response:
            return 200 <= response.status < 400
    except Exception:
        return False


def main(path: str):
    try:
        with open(path, 'r') as f:
            lines = [line.strip() for line in f if line.strip()]
    except IOError as e:
        print(f"Error reading {path}: {e}")
        return

    for url in lines:
        result = supports_https(url)
        print(f"{url} -> {'supports HTTPS' if result else 'no HTTPS'}")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(USAGE)
        sys.exit(1)
    main(sys.argv[1])

