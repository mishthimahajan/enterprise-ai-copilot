import os
import uuid
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    FilterSelector,
    MatchValue,
    PointStruct,
    VectorParams,
)


load_dotenv()


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

QDRANT_COLLECTION = os.getenv(
    "QDRANT_COLLECTION",
    "enterprise_documents_v2",
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "gemini-embedding-001",
)

# We explicitly request 768-dimensional embeddings.
VECTOR_SIZE = int(
    os.getenv(
        "EMBEDDING_DIMENSION",
        "768",
    )
)


if not QDRANT_URL:
    raise RuntimeError(
        "QDRANT_URL environment variable is missing."
    )

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY environment variable is missing."
    )


# ============================================================
# CLIENTS
# ============================================================

_qdrant_client: Optional[QdrantClient] = None
_gemini_client = None


def get_qdrant_client() -> QdrantClient:
    global _qdrant_client

    if _qdrant_client is None:
        print("Initializing Qdrant client...")

        _qdrant_client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY or None,
            timeout=60,
        )

        print("Qdrant client initialized.")

    return _qdrant_client


def get_gemini_client():
    global _gemini_client

    if _gemini_client is None:
        print("Initializing Gemini client...")

        _gemini_client = genai.Client(
            api_key=GEMINI_API_KEY
        )

        print("Gemini client initialized.")

    return _gemini_client


# ============================================================
# QDRANT COLLECTION
# ============================================================
def ensure_collection() -> None:
    client = get_qdrant_client()

    from qdrant_client.models import (
        Distance,
        PayloadSchemaType,
        VectorParams,
    )

    try:
        exists = client.collection_exists(
            collection_name=QDRANT_COLLECTION
        )

        if not exists:
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

        # Create payload indexes required for filtered search
        try:
            client.create_payload_index(
                collection_name=QDRANT_COLLECTION,
                field_name="agent_id",
                field_schema=PayloadSchemaType.KEYWORD,
                wait=True,
            )

            print(
                "Payload index ready: agent_id"
            )

        except Exception as error:
            # Qdrant may report that the index already exists.
            print(
                "agent_id index:",
                repr(error),
            )

        try:
            client.create_payload_index(
                collection_name=QDRANT_COLLECTION,
                field_name="document_id",
                field_schema=PayloadSchemaType.KEYWORD,
                wait=True,
            )

            print(
                "Payload index ready: document_id"
            )

        except Exception as error:
            print(
                "document_id index:",
                repr(error),
            )

    except Exception as error:
        print(
            "QDRANT COLLECTION ERROR:",
            repr(error),
        )
        raise

# Keep compatibility with your existing documents.py
def create_collection() -> None:
    ensure_collection()


# ============================================================
# GEMINI EMBEDDING
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

    client = get_gemini_client()

    try:
        result = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=clean_text,
            config=types.EmbedContentConfig(
                output_dimensionality=VECTOR_SIZE
            ),
        )

        if not result.embeddings:
            raise RuntimeError(
                "Gemini returned no embeddings."
            )

        values = result.embeddings[0].values

        if not values:
            raise RuntimeError(
                "Gemini embedding is empty."
            )

        return list(values)

    except Exception as error:
        print(
            "GEMINI EMBEDDING ERROR:",
            repr(error),
        )
        raise


# ============================================================
# STORE SINGLE CHUNK
# ============================================================

def store_chunk(
    text: str,
    agent_id: str,
    document_id: str,
    filename: str,
    chunk_index: int,
    metadata: Optional[Dict[str, Any]] = None,
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

        # Keep both keys for compatibility
        "content": text,
        "text": text,
    }

    if metadata:
        payload.update(metadata)

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

    for index, chunk in enumerate(chunks):
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
# SEARCH CHUNKS
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

    query_vector = create_embedding(
        clean_query
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
        response = client.query_points(
            collection_name=QDRANT_COLLECTION,
            query=query_vector,
            query_filter=search_filter,
            limit=limit,
            with_payload=True,
        )

        points = response.points

    except AttributeError:
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

    results: List[Dict[str, Any]] = []

    for point in points:
        payload = point.payload or {}

        content = (
            payload.get("content")
            or payload.get("text")
            or ""
        )

        results.append(
            {
                "content": content,
                "text": content,
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
                ),
                "score": float(
                    point.score
                ),
            }
        )

    print(
        f"Retrieved {len(results)} chunks"
    )

    for result in results:
        print(
            "SOURCE:",
            result.get("filename"),
            "score:",
            result.get("score"),
        )

    return results


# ============================================================
# DELETE DOCUMENT CHUNKS
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