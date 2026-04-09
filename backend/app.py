from fastapi import FastAPI

app = FastAPI(title="QOC RL Backend")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "QOC backend running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}