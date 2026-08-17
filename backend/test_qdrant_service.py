from services.qdrant_service import (
    create_collection
)


print("Starting Qdrant setup...")

create_collection()

print("Qdrant setup completed!")