import os
import uuid
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)


load_dotenv()


QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

QDRANT_COLLECTION = os.getenv(
    "QDRANT_COLLECTION",
    "enterprise_documents",
)

EMBEDDING_MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL_NAME",
    "sentence-transformers/all-MiniLM-L6-v2",
)



VECTOR_SIZE = 384


if not QDRANT_URL:
    raise RuntimeError(
        "QDRANT_URL environment variable is missing."
    )




client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY or None,
    timeout=60,
)




_embedding_model = None


def get_embedding_model():
    """
    Load the embedding model only when it is actually needed.

    IMPORTANT:
    We intentionally import SentenceTransformer inside this
    function so Render can start FastAPI quickly without loading
    PyTorch / HuggingFace models during application startup.
    """

    global _embedding_model

    if _embedding_model is None:
        print("Loading embedding model...")

        from sentence_transformers import SentenceTransformer

        _embedding_model = SentenceTransformer(
            EMBEDDING_MODEL_NAME
        )

        print(
            "Embedding model loaded successfully:",
            EMBEDDING_MODEL_NAME,
        )

    return _embedding_model




def ensure_collection() -> None:
    """
    Create the Qdrant collection if it does not already exist.

    This function is called lazily when indexing/searching rather
    than during FastAPI startup.
    """

    try:
        if client.collection_exists(
            collection_name=QDRANT_COLLECTION
        ):
            return

        print(
            f"Creating Qdrant collection: "
            f"{QDRANT_COLLECTION}"
        )

        client.create_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )

        print(
            f"Qdrant collection created: "
            f"{QDRANT_COLLECTION}"
        )

    except Exception as error:
        print(
            "QDRANT COLLECTION ERROR:",
            repr(error),
        )
        raise


def create_collection() -> None:
    """
    Backward-compatible wrapper.
    """
    ensure_collection()

def create_embedding(
    text: str,
) -> List[float]:
    """
    Convert text into a 384-dimensional embedding.
    """

    if not text:
        raise ValueError(
            "Cannot create embedding for empty text."
        )

    clean_text = text.strip()

    if not clean_text:
        raise ValueError(
            "Cannot create embedding for empty text."
        )

    model = get_embedding_model()

    embedding = model.encode(
        clean_text,
        normalize_embeddings=True,
    )

    return embedding.tolist()


# ============================================================
# STORE ONE CHUNK
# ============================================================

def store_chunk(
    text: str,
    agent_id: str,
    document_id: str,
    filename: str,
    chunk_index: int,
    metadata: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Store one document chunk and its embedding in Qdrant.
    """

    if not agent_id:
        raise ValueError(
            "agent_id is required."
        )

    if not document_id:
        raise ValueError(
            "document_id is required."
        )

    if not text or not text.strip():
        raise ValueError(
            "Chunk text cannot be empty."
        )

    ensure_collection()

    embedding = create_embedding(
        text
    )

    point_id = str(
        uuid.uuid4()
    )

    payload: Dict[str, Any] = {
        "agent_id": agent_id,
        "document_id": document_id,
        "filename": filename,
        "chunk_index": chunk_index,
        "content": text,
        "text": text,
    }

    if metadata:
        payload.update(
            metadata
        )

    point = PointStruct(
        id=point_id,
        vector=embedding,
        payload=payload,
    )

    try:
        client.upsert(
            collection_name=QDRANT_COLLECTION,
            points=[point],
            wait=True,
        )

        return point_id

    except Exception as error:
        print(
            "QDRANT STORE ERROR:",
            repr(error),
        )

        raise




def store_chunks(
    chunks: List[str],
    agent_id: str,
    document_id: str,
    filename: str,
) -> int:
    """
    Store all chunks belonging to one document.
    """

    if not chunks:
        return 0

    indexed_count = 0

    total = len(
        chunks
    )

    for index, chunk in enumerate(
        chunks
    ):
        if not chunk:
            continue

        clean_chunk = chunk.strip()

        if not clean_chunk:
            continue

        store_chunk(
            text=clean_chunk,
            agent_id=agent_id,
            document_id=document_id,
            filename=filename,
            chunk_index=index,
        )

        indexed_count += 1

        print(
            f"Indexed chunk "
            f"{indexed_count}/{total}"
        )

    return indexed_count




def search_chunks(
    query: str,
    agent_id: str,
    document_id: Optional[str] = None,
    limit: int = 5,
) -> List[Dict[str, Any]]:
    """
    Semantic search over indexed chunks.

    Search is always restricted to agent_id.

    If document_id is provided, search is additionally restricted
    to that specific document.
    """

    if not query:
        return []

    if not query.strip():
        return []

    if not agent_id:
        raise ValueError(
            "agent_id is required."
        )

    ensure_collection()

    query_vector = create_embedding(
        query
    )

    must_conditions = [
        FieldCondition(
            key="agent_id",
            match=MatchValue(
                value=agent_id
            ),
        )
    ]

    if document_id:
        must_conditions.append(
            FieldCondition(
                key="document_id",
                match=MatchValue(
                    value=document_id
                ),
            )
        )

    search_filter = Filter(
        must=must_conditions
    )

    try:
        # Newer qdrant-client API
        response = client.query_points(
            collection_name=QDRANT_COLLECTION,
            query=query_vector,
            query_filter=search_filter,
            limit=limit,
            with_payload=True,
        )

        points = response.points

    except AttributeError:
        # Compatibility with older qdrant-client releases
        points = client.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=query_vector,
            query_filter=search_filter,
            limit=limit,
            with_payload=True,
        )

    except Exception as error:
        print(
            "QDRANT SEARCH ERROR:",
            repr(error),
        )

        raise

    results: List[
        Dict[str, Any]
    ] = []

    for point in points:
        payload = (
            point.payload or {}
        )

        content = (
            payload.get("content")
            or payload.get("text")
            or ""
        )

        result = {
            "content": content,
            "text": content,

            "agent_id":
                payload.get(
                    "agent_id"
                ),

            "document_id":
                payload.get(
                    "document_id"
                ),

            "filename":
                payload.get(
                    "filename"
                ),

            "chunk_index":
                payload.get(
                    "chunk_index"
                ),

            "score":
                float(
                    point.score
                ),
        }

        results.append(
            result
        )

    print(
        f"Retrieved "
        f"{len(results)} chunks"
    )

    for result in results:
        print(
            "SOURCE:",
            result.get(
                "filename"
            ),
            "score:",
            result.get(
                "score"
            ),
        )

    return results



def delete_document_chunks(
    agent_id: str,
    document_id: str,
) -> None:
    """
    Delete all vector chunks associated with one document.
    """

    if not agent_id:
        raise ValueError(
            "agent_id is required."
        )

    if not document_id:
        raise ValueError(
            "document_id is required."
        )

    ensure_collection()

    delete_filter = Filter(
        must=[
            FieldCondition(
                key="agent_id",
                match=MatchValue(
                    value=agent_id
                ),
            ),
            FieldCondition(
                key="document_id",
                match=MatchValue(
                    value=document_id
                ),
            ),
        ]
    )

    try:
        from qdrant_client.models import (
            FilterSelector,
        )

        client.delete(
            collection_name=QDRANT_COLLECTION,
            points_selector=FilterSelector(
                filter=delete_filter
            ),
            wait=True,
        )

        print(
            "Deleted Qdrant chunks for document:",
            document_id,
        )

    except Exception as error:
        print(
            "QDRANT DELETE ERROR:",
            repr(error),
        )

        raise




def check_qdrant_connection() -> bool:
    """
    Optional Qdrant connection test.

    Do NOT automatically call this when importing main.py.
    """

    try:
        client.get_collections()

        print(
            "Qdrant connection successful."
        )

        return True

    except Exception as error:
        print(
            "Qdrant connection failed:",
            repr(error),
        )

        return False