


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

from dotenv import load_dotenv
from qdrant_client import QdrantClient

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()

if not QDRANT_URL:
    raise RuntimeError("QDRANT_URL is missing")

client = QdrantClient(
    url=QDRANT_URL.rstrip("/"),
    api_key=QDRANT_API_KEY or None,
    timeout=180,
    prefer_grpc=False,
    check_compatibility=False,
)