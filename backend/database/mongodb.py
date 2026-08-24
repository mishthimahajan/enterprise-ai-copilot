from pymongo import MongoClient
import os

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017"
)

client = MongoClient(MONGO_URI)

db = client["enterprise_ai"]

users_collection = db["users"]


documents_collection = db["documents"]
agents_collection = db["agents"]
chat_collection = db["chat_messages"]