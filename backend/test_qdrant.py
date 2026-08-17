from qdrant_client import QdrantClient

print("Connecting to Qdrant...")

try:
    client = QdrantClient(
        host="localhost",
        port=6333
    )

    print("Client created.")

    collections = client.get_collections()

    print("Qdrant is connected successfully!")
    print("Collections:")

    for collection in collections.collections:
        print("-", collection.name)

except Exception as e:
    print("Qdrant connection failed!")
    print("Error:", e)