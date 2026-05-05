import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse


class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # API endpoints
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {"message": "QOC backend running"}
            self.wfile.write(json.dumps(response).encode())
        elif self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {"status": "ok"}
            self.wfile.write(json.dumps(response).encode())
        elif self.path.startswith("/api/"):
            # API routes
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {"message": "API endpoint"}
            self.wfile.write(json.dumps(response).encode())
        else:
            # Default 404 for API calls
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {"error": "Not found"}
            self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        print(format % args)


def run_server(port=8000):
    server = HTTPServer(("0.0.0.0", port), RequestHandler)
    print(f"Backend server running on port {port}")
    server.serve_forever()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port)