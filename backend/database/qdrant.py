# from qdrant_client import QdrantClient
# from qdrant_client.models import Distance,VectorParams

# QDRANT_URL = "http://localhost:6333"

# COLLECTION_NAME = "enterprise_documents"

# VECTOR_SIZE = 384

# client = QdrantClient(url=QDRANT_URL)

# def create_collection():
#     """

#     Create the Qdrant collection if it does not already exist.
#     """

#     collections = client.get_collection()

#     existing_collections = [
#         collection.name
#         for collection in collections.collections


#     ]

#     if COLLECTION_NAME not in existing_collections:

#         client.create_collection(
#             collection_name=COLLECTION_NAME,
#             vector_config= VectorParams(
#                 size= VECTOR_SIZE,
#                 distance=Distance.COSINE,
#             ),
#         )
#         print (
#             f"Qdrant collection '{COLLECTION_NAME}' created."

#         )
#     else :

#         print(
#             f"Qdrant collection '{COLLECTION_NAME}' already exists."
#         )
# def get_qdrant_client():
#     """

#     Return the Qdrant client.

#     """

#     return client


import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient


load_dotenv()


QDRANT_URL = os.getenv(
    "QDRANT_URL"
)

QDRANT_API_KEY = os.getenv(
    "QDRANT_API_KEY"
)


if not QDRANT_URL:
    raise RuntimeError(
        "QDRANT_URL is missing"
    )


client = QdrantClient(
    url=QDRANT_URL,
    api_key=(
        QDRANT_API_KEY
        if QDRANT_API_KEY
        else None
    ),
    timeout=60,
)