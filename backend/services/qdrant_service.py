import os
import uuid
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv




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




_qdrant_client = None
_embedding_model = None




def get_qdrant_client():
    """
    Create Qdrant client only when a RAG operation
    actually needs it.

    This prevents Qdrant/FastEmbed/ONNX initialization
    during FastAPI startup on Render.
    """

    global _qdrant_client

    if _qdrant_client is None:
        print("Initializing Qdrant client...")

        
        from qdrant_client import QdrantClient

        _qdrant_client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY or None,
            timeout=60,
        )

        print("Qdrant client initialized.")

    return _qdrant_client




def get_embedding_model():
    """
    Load SentenceTransformer only when an embedding
    is actually required.

    FastAPI can therefore start without loading Torch,
    HuggingFace, ONNX, etc.
    """

    global _embedding_model

    if _embedding_model is None:
        print("Loading embedding model...")

        
        from sentence_transformers import SentenceTransformer

        _embedding_model = SentenceTransformer(
            EMBEDDING_MODEL_NAME
        )

        print(
            "Embedding model loaded:",
            EMBEDDING_MODEL_NAME,
        )

    return _embedding_model




def ensure_collection() -> None:
    """
    Create Qdrant collection if it does not exist.
    """

    client = get_qdrant_client()

    # Lazy imports
    from qdrant_client.models import (
        Distance,
        VectorParams,
    )

    try:
        exists = client.collection_exists(
            collection_name=QDRANT_COLLECTION
        )

        if exists:
            return

        print(
            "Creating Qdrant collection:",
            QDRANT_COLLECTION,
        )

        client.create_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )

        print(
            "Qdrant collection created:",
            QDRANT_COLLECTION,
        )

    except Exception as error:
        print(
            "QDRANT COLLECTION ERROR:",
            repr(error),
        )

        raise


# ============================================================
# BACKWARD COMPATIBILITY
# ============================================================

def create_collection() -> None:
    """
    Existing documents.py may still call
    create_collection().
    """

    ensure_collection()


# ============================================================
# EMBEDDING
# ============================================================

def create_embedding(
    text: str,
) -> List[float]:

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
# STORE SINGLE CHUNK
# ============================================================

def store_chunk(
    text: str,
    agent_id: str,
    document_id: str,
    filename: str,
    chunk_index: int,
    metadata: Optional[
        Dict[str, Any]
    ] = None,
) -> str:

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

    client = get_qdrant_client()

    # Lazy import
    from qdrant_client.models import (
        PointStruct,
    )

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

        # Keep both for compatibility
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


# ============================================================
# STORE MULTIPLE CHUNKS
# ============================================================

def store_chunks(
    chunks: List[str],
    agent_id: str,
    document_id: str,
    filename: str,
) -> int:

    if not chunks:
        return 0

    indexed_count = 0

    total = len(chunks)

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


# ============================================================
# SEARCH
# ============================================================

def search_chunks(
    query: str,
    agent_id: str,
    document_id: Optional[str] = None,
    limit: int = 5,
) -> List[Dict[str, Any]]:

    if not query:
        return []

    clean_query = query.strip()

    if not clean_query:
        return []

    if not agent_id:
        raise ValueError(
            "agent_id is required."
        )

    ensure_collection()

    client = get_qdrant_client()

    # Lazy imports
    from qdrant_client.models import (
        FieldCondition,
        Filter,
        MatchValue,
    )

    query_vector = create_embedding(
        clean_query
    )

    conditions = [
        FieldCondition(
            key="agent_id",
            match=MatchValue(
                value=agent_id
            ),
        )
    ]

    if document_id:
        conditions.append(
            FieldCondition(
                key="document_id",
                match=MatchValue(
                    value=document_id
                ),
            )
        )

    search_filter = Filter(
        must=conditions
    )

    try:
        response = client.query_points(
            collection_name=QDRANT_COLLECTION,
            query=query_vector,
            query_filter=search_filter,
            limit=limit,
            with_payload=True,
        )

        points = response.points

    except AttributeError:
        # For older qdrant-client versions

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


# ============================================================
# DELETE DOCUMENT VECTORS
# ============================================================

def delete_document_chunks(
    agent_id: str,
    document_id: str,
) -> None:

    if not agent_id:
        raise ValueError(
            "agent_id is required."
        )

    if not document_id:
        raise ValueError(
            "document_id is required."
        )

    ensure_collection()

    client = get_qdrant_client()

    # Lazy imports
    from qdrant_client.models import (
        FieldCondition,
        Filter,
        FilterSelector,
        MatchValue,
    )

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
        client.delete(
            collection_name=QDRANT_COLLECTION,

            points_selector=FilterSelector(
                filter=delete_filter
            ),

            wait=True,
        )

        print(
            "Deleted chunks for document:",
            document_id,
        )

    except Exception as error:
        print(
            "QDRANT DELETE ERROR:",
            repr(error),
        )

        raise


# ============================================================
# CONNECTION TEST
# ============================================================

def check_qdrant_connection() -> bool:
    """
    Optional connection test.

    DO NOT automatically execute this during
    main.py import.
    """

    try:
        client = get_qdrant_client()

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