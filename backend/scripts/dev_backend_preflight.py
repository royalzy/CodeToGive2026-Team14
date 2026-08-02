from __future__ import annotations

import argparse
import socket
from dataclasses import dataclass
from http.client import HTTPConnection


@dataclass(frozen=True)
class BackendStatus:
    state: str
    detail: str


def inspect_backend(
    host: str = "127.0.0.1",
    port: int = 8000,
    health_path: str = "/api/health",
    timeout_seconds: float = 1.5,
) -> BackendStatus:
    try:
        with socket.create_connection((host, port), timeout=timeout_seconds):
            pass
    except OSError:
        return BackendStatus("free", f"{host}:{port} is free")

    connection = HTTPConnection(host, port, timeout=timeout_seconds)
    try:
        connection.request("GET", health_path)
        response = connection.getresponse()
        response.read()
    except OSError as error:
        return BackendStatus(
            "unhealthy",
            f"{host}:{port} accepts connections but {health_path} did not respond: {error}",
        )
    finally:
        connection.close()

    if response.status == 200:
        return BackendStatus(
            "healthy",
            f"{host}:{port} already serves a healthy Love 21 API",
        )
    return BackendStatus(
        "unhealthy",
        f"{host}:{port} returned HTTP {response.status} for {health_path}",
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Refuse to start a second or unresponsive local Love 21 backend.",
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    parser.add_argument("--health-path", default="/api/health")
    parser.add_argument("--timeout", default=1.5, type=float)
    args = parser.parse_args()

    status = inspect_backend(
        host=args.host,
        port=args.port,
        health_path=args.health_path,
        timeout_seconds=args.timeout,
    )
    if status.state == "free":
        print(f"Backend preflight passed: {status.detail}.")
        return 0

    print(f"Backend preflight stopped: {status.detail}.")
    if status.state == "healthy":
        print("Stop the existing backend before starting another local stack.")
        return 2

    print(f"Inspect the owner with: lsof -nP -iTCP:{args.port} -sTCP:LISTEN")
    print("Stop only the confirmed stale process, then run the command again.")
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
