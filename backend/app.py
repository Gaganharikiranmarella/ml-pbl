"""Minimal ASGI entrypoint for Vercel Python detection.

This keeps the backend service build from failing when Vercel scans the repo
and expects a Python entrypoint at backend/app.py.
"""


async def app(scope, receive, send):
    if scope["type"] != "http":
        return

    headers = [(b"content-type", b"text/plain; charset=utf-8")]
    await send({"type": "http.response.start", "status": 200, "headers": headers})
    await send(
        {
            "type": "http.response.body",
            "body": b"QOC backend placeholder. Frontend lives in frontend/.",
        }
    )