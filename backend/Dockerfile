# ── Stage 1: Clone markitdown from Microsoft ──────────────────────────
FROM python:3.12-slim AS cloner

RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN git clone --depth 1 https://github.com/microsoft/markitdown.git .

# ── Stage 2: Build the runtime image ─────────────────────────────────
FROM python:3.12-slim

LABEL maintainer="markitdown-web"

# Copy the markitdown package from the cloner stage
COPY --from=cloner /src/packages/markitdown /build/markitdown

# Install markitdown[all] + FastAPI deps
RUN pip install --no-cache-dir "/build/markitdown[all]" \
    && rm -rf /build

WORKDIR /app

# Copy the FastAPI application
COPY main.py requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
