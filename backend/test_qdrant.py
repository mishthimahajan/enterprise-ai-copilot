import os
from pathlib import Path

from dotenv import load_dotenv
from qdrant_client import QdrantClient


# ------------------------------------------------------------
# Load backend/.env explicitly
# ------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=True)


# ------------------------------------------------------------
# Read Qdrant configuration
# ------------------------------------------------------------

QDRANT_URL = os.getenv("QDRANT_URL", "").strip().rstrip("/")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()


if not QDRANT_URL:
    raise RuntimeError("QDRANT_URL is missing from backend/.env")

if not QDRANT_API_KEY:
    raise RuntimeError("QDRANT_API_KEY is missing from backend/.env")


print("Environment file:", ENV_FILE)
print("Qdrant URL:", QDRANT_URL)
print("API key loaded:", bool(QDRANT_API_KEY))
print()


# ------------------------------------------------------------
# Create Qdrant client
# ------------------------------------------------------------

try:
    print("Connecting to Qdrant...")

    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        timeout=60,
        prefer_grpc=False,
        check_compatibility=False,
    )

    print("Client created.")
    print("Testing Qdrant REST connection...")

    collections = client.get_collections()

    print()
    print("QDRANT CONNECTION SUCCESS")
    print()

    print("Collections:")

    for collection in collections.collections:
        print(" -", collection.name)

except Exception as error:
    print()
    print("QDRANT CONNECTION FAILED")
    print("Error type:", type(error).__name__)
    print("Error:", repr(error))

    raise