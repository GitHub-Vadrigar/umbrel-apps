from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.request
import json
import shutil
import os

os.chdir("/app")

class Handler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"

        elif self.path == "/system":
            total, used, free = shutil.disk_usage("/")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()

            self.wfile.write(json.dumps({
                "total": total,
                "used": used,
                "free": free
            }).encode())
            return

        return super().do_GET()

    def do_POST(self):
        if self.path == "/json_rpc":

            length = int(self.headers['Content-Length'])
            body = self.rfile.read(length)

            req = urllib.request.Request(
                "http://127.0.0.1:17566/json_rpc",
                data=body,
                headers={'Content-Type': 'application/json'}
            )

            response = urllib.request.urlopen(req)
            result = response.read()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            self.wfile.write(result)

        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

HTTPServer(("", 3000), Handler).serve_forever()
