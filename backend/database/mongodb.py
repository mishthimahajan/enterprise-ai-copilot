import os

import certifi

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()


MONGO_URI = os.getenv(
    "MONGO_URI"
)

MONGO_DB_NAME = os.getenv(
    "MONGO_DB_NAME",
    "enterprise_ai"
)


if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is not configured"
    )


client = MongoClient(
    MONGO_URI,

    tls=True,

    tlsCAFile=certifi.where(),

    serverSelectionTimeoutMS=30000,

    connectTimeoutMS=30000,

    socketTimeoutMS=30000,
)


db = client[
    MONGO_DB_NAME
]


users_collection = db[
    "users"
]

agents_collection = db[
    "agents"
]

documents_collection = db[
    "documents"
]

chat_collection = db[
    "chat_messages"
]