from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread

from scripts.dev_backend_preflight import inspect_backend


class HealthHandler(BaseHTTPRequestHandler):
    health_status = 200

    def do_GET(self) -> None:
        self.send_response(self.health_status if self.path == "/api/health" else 404)
        self.end_headers()
        self.wfile.write(b"ok")

    def log_message(self, _format: str, *_args: object) -> None:
        return


def serve_health(status: int) -> tuple[ThreadingHTTPServer, Thread]:
    handler = type("ConfiguredHealthHandler", (HealthHandler,), {"health_status": status})
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, thread


def test_preflight_accepts_a_free_port() -> None:
    server, thread = serve_health(200)
    port = server.server_port
    server.shutdown()
    server.server_close()
    thread.join()

    assert inspect_backend(port=port).state == "free"


def test_preflight_identifies_an_existing_healthy_backend() -> None:
    server, thread = serve_health(200)
    try:
        status = inspect_backend(port=server.server_port)
        assert status.state == "healthy"
        assert "healthy Love 21 API" in status.detail
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def test_preflight_rejects_an_unhealthy_listener() -> None:
    server, thread = serve_health(503)
    try:
        status = inspect_backend(port=server.server_port)
        assert status.state == "unhealthy"
        assert "HTTP 503" in status.detail
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
