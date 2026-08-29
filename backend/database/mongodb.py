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

    serverSelectionTimeoutMS=60000,

    connectTimeoutMS=60000,

    socketTimeoutMS=120000,
    retryWrites=True,
    retryReads=True,

    maxPoolSize=50,
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

repositories_collection = db[
    "repositories"
]

try:
    repositories_collection.create_index(
        "repository_id",
        unique=True,
    )

    print(
        "Repository index created successfully."
    )

except Exception as error:
    print(
        "REPOSITORY INDEX WARNING:",
        repr(error),
    )