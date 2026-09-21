


# import os

# from dotenv import load_dotenv
# from qdrant_client import QdrantClient


# load_dotenv()


# QDRANT_URL = os.getenv(
#     "QDRANT_URL"
# )

# QDRANT_API_KEY = os.getenv(
#     "QDRANT_API_KEY"
# )


# if not QDRANT_URL:
#     raise RuntimeError(
#         "QDRANT_URL is missing"
#     )


# client = QdrantClient(
#     url=QDRANT_URL,
#     api_key=(
#         QDRANT_API_KEY
#         if QDRANT_API_KEY
#         else None
#     ),
#     timeout=60,
# )

import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
from qdrant_client import QdrantClient


# backend/database/qdrant.py -> backend/.env
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"

# Load the local .env only if the variable is not already
# configured in the environment (e.g. on Render).
load_dotenv(dotenv_path=ENV_PATH, override=False)


QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()


if not QDRANT_URL:
    raise RuntimeError(
        "QDRANT_URL is missing. Check backend/.env or Render environment variables."
    )


if not QDRANT_URL.startswith(("https://", "http://")):
    raise RuntimeError(
        "QDRANT_URL must start with https:// or http://."
    )


print(
    "Database Qdrant hostname:",
    urlparse(QDRANT_URL).hostname,
    flush=True,
)


client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY or None,
    timeout=180,
)