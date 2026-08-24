import uuid
from typing import Optional

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from fastembed import TextEmbedding




QDRANT_URL = "http://localhost:6333"

COLLECTION_NAME = "enterprise_documents"

# all-MiniLM-L6-v2 produces 384-dimensional embeddings
VECTOR_SIZE = 384




client = QdrantClient(
    url=QDRANT_URL
)




embedding_model = TextEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)




def create_collection():

    try:

        collections = client.get_collections()

        existing_collections = [
            collection.name
            for collection in collections.collections
        ]

        if COLLECTION_NAME in existing_collections:

            print(
                f"Qdrant collection already exists: "
                f"{COLLECTION_NAME}"
            )

            return


        client.create_collection(

            collection_name=COLLECTION_NAME,

            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )

        print(
            f"Created Qdrant collection: "
            f"{COLLECTION_NAME}"
        )

    except Exception as e:

        print(
            "Qdrant collection creation error:",
            e
        )

        raise




def create_embedding(text: str):

    if not text or not text.strip():

        raise ValueError(
            "Cannot create embedding for empty text"
        )

    embeddings = list(
        embedding_model.embed([text])
    )

    return embeddings[0].tolist()




def store_chunk(
    text: str,
    agent_id: str,
    document_id: str,
    filename: str,
    chunk_index: int
):

    if not text or not text.strip():

        raise ValueError(
            "Cannot store an empty chunk"
        )




    vector = create_embedding(text)




    point_id = str(
        uuid.uuid4()
    )




    payload = {

        "text": text,

        "agent_id": agent_id,

        "document_id": document_id,

        "filename": filename,

        "chunk_index": chunk_index
    }




    client.upsert(

        collection_name=COLLECTION_NAME,

        points=[

            PointStruct(

                id=point_id,

                vector=vector,

                payload=payload
            )
        ]
    )


    print(
        f"Indexed chunk "
        f"{chunk_index + 1}"
    )


    return point_id




def search_chunks(
    query: str,
    agent_id: str,
    document_id: Optional[str] = None,
    limit: int = 5
):
    if not query or not query.strip():
        return []

    query_vector = create_embedding(query)

    conditions = [
        FieldCondition(
            key="agent_id",
            match=MatchValue(
                value=agent_id
            )
        )
    ]

    if document_id:
        conditions.append(
            FieldCondition(
                key="document_id",
                match=MatchValue(
                    value=document_id
                )
            )
        )

    query_filter = Filter(
        must=conditions
    )

    try:
        response = client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            query_filter=query_filter,
            limit=limit,
            with_payload=True,
        )

        points = response.points

        formatted_results = []

        for result in points:
            payload = result.payload or {}

            formatted_results.append({
                "score": result.score,
                "text": payload.get(
                    "text",
                    ""
                ),
                "agent_id": payload.get(
                    "agent_id"
                ),
                "document_id": payload.get(
                    "document_id"
                ),
                "filename": payload.get(
                    "filename"
                ),
                "chunk_index": payload.get(
                    "chunk_index"
                )
            })

        return formatted_results

    except Exception as e:
        print(
            "QDRANT SEARCH ERROR:",
            repr(e)
        )
        raise



if __name__ == "__main__":

    print(
        "Testing Qdrant connection..."
    )

    collections = client.get_collections()

    print(
        "Qdrant connected successfully!"
    )

    print(
        "Collections:",
        [
            collection.name
            for collection in collections.collections
        ]
    )