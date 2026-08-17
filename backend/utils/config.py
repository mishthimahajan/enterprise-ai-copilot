import os

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "your-super-secret-key-change-this"
)

ALGORITHM = "HS256"