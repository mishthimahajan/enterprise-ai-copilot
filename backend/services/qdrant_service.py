import os
import time
import uuid

from typing import (
    Any,
    Dict,
    List,
    Optional,
)

from dotenv import load_dotenv

from fastembed import TextEmbedding

from qdrant_client import QdrantClient

from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    FilterSelector,
    MatchValue,
    PayloadSchemaType,
    PointStruct,
    VectorParams,
)


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

load_dotenv()


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

QDRANT_URL = os.getenv(
    "QDRANT_URL"
)

QDRANT_API_KEY = os.getenv(
    "QDRANT_API_KEY"
)


# IMPORTANT:
#
# Do NOT use your old 768-dimensional collection.
#
# FastEmbed MiniLM generates 384-dimensional vectors.
#
# Recommended .env:
#
# QDRANT_COLLECTION=enterprise_documents_v3_fastembed
#
QDRANT_COLLECTION = os.getenv(
    "QDRANT_COLLECTION",
    "enterprise_documents_v3_fastembed",
)


EMBEDDING_MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL_NAME",
    "sentence-transformers/all-MiniLM-L6-v2",
)


VECTOR_SIZE = 384


# ============================================================
# VALIDATE CONFIGURATION
# ============================================================

if not QDRANT_URL:

    raise RuntimeError(
        "QDRANT_URL environment variable is missing."
    )


# ============================================================
# LAZY CLIENTS
# ============================================================

_qdrant_client: Optional[
    QdrantClient
] = None


_embedding_model: Optional[
    TextEmbedding
] = None


# ============================================================
# QDRANT CLIENT
# ============================================================

def get_qdrant_client() -> QdrantClient:

    global _qdrant_client


    if _qdrant_client is None:

        print(
            "Initializing Qdrant client...",
            flush=True,
        )


        _qdrant_client = QdrantClient(

            url=QDRANT_URL,

            api_key=(
                QDRANT_API_KEY
                or None
            ),

            # Increased for larger GitHub indexing jobs.
            timeout=180,
        )


        print(
            "Qdrant client initialized.",
            flush=True,
        )


    return _qdrant_client


# ============================================================
# FASTEMBED MODEL
# ============================================================

def get_embedding_model() -> TextEmbedding:

    global _embedding_model


    if _embedding_model is None:

        print(
            "Initializing FastEmbed model:",
            EMBEDDING_MODEL_NAME,
            flush=True,
        )


        _embedding_model = TextEmbedding(
            model_name=
                EMBEDDING_MODEL_NAME
        )


        print(
            "FastEmbed model initialized.",
            flush=True,
        )


    return _embedding_model


# ============================================================
# QDRANT COLLECTION
# ============================================================

def ensure_collection() -> None:

    client = (
        get_qdrant_client()
    )


    try:

        exists = (
            client.collection_exists(
                collection_name=
                    QDRANT_COLLECTION
            )
        )


        # ====================================================
        # CREATE COLLECTION
        # ====================================================

        if not exists:

            print(
                "Creating Qdrant collection:",
                QDRANT_COLLECTION,
                flush=True,
            )


            client.create_collection(

                collection_name=
                    QDRANT_COLLECTION,

                vectors_config=
                    VectorParams(

                        size=
                            VECTOR_SIZE,

                        distance=
                            Distance.COSINE,
                    ),
            )


            print(
                "Qdrant collection created:",
                QDRANT_COLLECTION,
                flush=True,
            )


        # ====================================================
        # VERIFY VECTOR DIMENSION
        # ====================================================

        collection_info = (
            client.get_collection(
                QDRANT_COLLECTION
            )
        )


        try:

            current_size = (
                collection_info
                .config
                .params
                .vectors
                .size
            )


            if (
                current_size
                != VECTOR_SIZE
            ):

                raise RuntimeError(
                    (
                        "Qdrant collection dimension mismatch. "
                        f"Collection '{QDRANT_COLLECTION}' "
                        f"uses {current_size} dimensions, "
                        f"but FastEmbed requires "
                        f"{VECTOR_SIZE}. "
                        "Use a new QDRANT_COLLECTION name."
                    )
                )

        except AttributeError:
            # Different qdrant-client versions may expose
            # the collection metadata differently.
            pass


        # ====================================================
        # PAYLOAD INDEX: agent_id
        # ====================================================

        try:

            client.create_payload_index(

                collection_name=
                    QDRANT_COLLECTION,

                field_name=
                    "agent_id",

                field_schema=
                    PayloadSchemaType.KEYWORD,

                wait=True,
            )


            print(
                "Payload index ready: agent_id",
                flush=True,
            )


        except Exception:
            # Usually means it already exists.
            pass


        # ====================================================
        # PAYLOAD INDEX: document_id
        # ====================================================

        try:

            client.create_payload_index(

                collection_name=
                    QDRANT_COLLECTION,

                field_name=
                    "document_id",

                field_schema=
                    PayloadSchemaType.KEYWORD,

                wait=True,
            )


            print(
                "Payload index ready: document_id",
                flush=True,
            )


        except Exception:
            pass


        # ====================================================
        # PAYLOAD INDEX: repository_id
        # ====================================================

        try:

            client.create_payload_index(

                collection_name=
                    QDRANT_COLLECTION,

                field_name=
                    "repository_id",

                field_schema=
                    PayloadSchemaType.KEYWORD,

                wait=True,
            )


            print(
                "Payload index ready: repository_id",
                flush=True,
            )


        except Exception:
            pass


        # ====================================================
        # PAYLOAD INDEX: source_type
        # ====================================================

        try:

            client.create_payload_index(

                collection_name=
                    QDRANT_COLLECTION,

                field_name=
                    "source_type",

                field_schema=
                    PayloadSchemaType.KEYWORD,

                wait=True,
            )


            print(
                "Payload index ready: source_type",
                flush=True,
            )


        except Exception:
            pass


    except Exception as error:

        print(
            "QDRANT COLLECTION ERROR:",
            repr(error),
            flush=True,
        )

        raise


# ============================================================
# COMPATIBILITY FUNCTION
# ============================================================

def create_collection() -> None:

    ensure_collection()


# ============================================================
# SINGLE EMBEDDING
# ============================================================

def create_embedding(
    text: str,
) -> List[float]:

    if (
        not text
        or
        not text.strip()
    ):

        raise ValueError(
            "Cannot create embedding for empty text."
        )


    clean_text = (
        text.strip()
    )


    model = (
        get_embedding_model()
    )


    try:

        embeddings = list(
            model.embed(
                [clean_text]
            )
        )


        if not embeddings:

            raise RuntimeError(
                "FastEmbed returned no embeddings."
            )


        vector = embeddings[0]


        values = (

            vector.tolist()

            if hasattr(
                vector,
                "tolist",
            )

            else list(
                vector
            )
        )


        if (
            len(values)
            != VECTOR_SIZE
        ):

            raise RuntimeError(
                (
                    "Embedding dimension mismatch. "
                    f"Expected {VECTOR_SIZE}, "
                    f"received {len(values)}."
                )
            )


        return values


    except Exception as error:

        print(
            "FASTEMBED ERROR:",
            repr(error),
            flush=True,
        )

        raise


# ============================================================
# BATCH EMBEDDINGS
# ============================================================

def create_embeddings_batch(
    texts: List[str],
) -> List[List[float]]:

    if not texts:

        return []


    cleaned_texts = []


    for text in texts:

        clean_text = (
            text or ""
        ).strip()


        if not clean_text:

            raise ValueError(
                "Empty text found inside embedding batch."
            )


        cleaned_texts.append(
            clean_text
        )


    model = (
        get_embedding_model()
    )


    try:

        raw_embeddings = list(
            model.embed(
                cleaned_texts
            )
        )


        if (
            len(raw_embeddings)
            != len(cleaned_texts)
        ):

            raise RuntimeError(
                (
                    "Embedding count mismatch. "
                    f"Texts: {len(cleaned_texts)}, "
                    f"Embeddings: {len(raw_embeddings)}."
                )
            )


        result: List[
            List[float]
        ] = []


        for vector in raw_embeddings:

            values = (

                vector.tolist()

                if hasattr(
                    vector,
                    "tolist",
                )

                else list(
                    vector
                )
            )


            if (
                len(values)
                != VECTOR_SIZE
            ):

                raise RuntimeError(
                    (
                        "Embedding dimension mismatch. "
                        f"Expected {VECTOR_SIZE}, "
                        f"received {len(values)}."
                    )
                )


            result.append(
                values
            )


        return result


    except Exception as error:

        print(
            "FASTEMBED BATCH ERROR:",
            repr(error),
            flush=True,
        )

        raise


# ============================================================
# DETERMINISTIC POINT ID
# ============================================================

def generate_point_id(
    agent_id: str,
    source_id: str,
    filename: str,
    chunk_index: int,
) -> str:

    """
    Generate the same Qdrant ID for the same chunk.

    This prevents duplicate vectors if repository
    indexing fails halfway and is retried.
    """

    unique_value = (
        f"{agent_id}:"
        f"{source_id}:"
        f"{filename}:"
        f"{chunk_index}"
    )


    return str(
        uuid.uuid5(
            uuid.NAMESPACE_URL,
            unique_value,
        )
    )


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


    clean_text = (
        text or ""
    ).strip()


    if not clean_text:

        raise ValueError(
            "Chunk text cannot be empty."
        )


    ensure_collection()


    client = (
        get_qdrant_client()
    )


    embedding = (
        create_embedding(
            clean_text
        )
    )


    source_id = document_id


    if metadata:

        repository_id = (
            metadata.get(
                "repository_id"
            )
        )


        if repository_id:

            source_id = (
                repository_id
            )


    point_id = (
        generate_point_id(

            agent_id=
                agent_id,

            source_id=
                source_id,

            filename=
                filename,

            chunk_index=
                chunk_index,
        )
    )


    payload: Dict[
        str,
        Any,
    ] = {

        "agent_id":
            agent_id,

        "document_id":
            document_id,

        "filename":
            filename,

        "chunk_index":
            chunk_index,

        "source_type":
            "document",

        "content":
            clean_text,

        "text":
            clean_text,
    }


    if metadata:

        payload.update(
            metadata
        )


    point = PointStruct(

        id=
            point_id,

        vector=
            embedding,

        payload=
            payload,
    )


    # ========================================================
    # RETRY SINGLE UPSERT
    # ========================================================

    max_retries = 4


    for attempt in range(
        1,
        max_retries + 1,
    ):

        try:

            client.upsert(

                collection_name=
                    QDRANT_COLLECTION,

                points=[
                    point
                ],

                wait=True,
            )


            return point_id


        except Exception as error:

            print(
                (
                    "QDRANT STORE ERROR "
                    f"(attempt "
                    f"{attempt}/"
                    f"{max_retries}):"
                ),
                repr(error),
                flush=True,
            )


            if (
                attempt
                == max_retries
            ):

                raise


            wait_seconds = (
                attempt * 3
            )


            print(
                (
                    "Retrying Qdrant store in "
                    f"{wait_seconds} seconds..."
                ),
                flush=True,
            )


            time.sleep(
                wait_seconds
            )


    return point_id


# ============================================================
# STORE CHUNKS BATCH
# ============================================================

def store_chunks_batch(

    chunks_data:
        List[Dict[str, Any]],

    batch_size: int = 10,

) -> int:

    """
    Store multiple document/GitHub chunks.

    FastEmbed generates embeddings locally.

    Qdrant upsert is done in batches of 10.

    Failed network requests are retried.
    """


    if not chunks_data:

        print(
            "No chunks supplied.",
            flush=True,
        )

        return 0


    ensure_collection()


    client = (
        get_qdrant_client()
    )


    # ========================================================
    # VALIDATE CHUNKS
    # ========================================================

    valid_items: List[
        Dict[str, Any]
    ] = []


    for item in chunks_data:

        text = (
            item.get(
                "text"
            )
            or ""
        ).strip()


        if not text:

            continue


        agent_id = (
            item.get(
                "agent_id"
            )
        )


        document_id = (
            item.get(
                "document_id"
            )
        )


        filename = (
            item.get(
                "filename"
            )
        )


        if not agent_id:

            raise ValueError(
                "agent_id missing from batch item."
            )


        if not document_id:

            raise ValueError(
                "document_id missing from batch item."
            )


        if not filename:

            raise ValueError(
                "filename missing from batch item."
            )


        clean_item = dict(
            item
        )


        clean_item[
            "text"
        ] = text


        valid_items.append(
            clean_item
        )


    if not valid_items:

        return 0


    total_items = len(
        valid_items
    )


    stored_items = 0


    print(
        (
            "Starting Qdrant batch storage: "
            f"{total_items} chunks"
        ),
        flush=True,
    )


    # ========================================================
    # PROCESS SMALL BATCHES
    # ========================================================

    for start in range(
        0,
        total_items,
        batch_size,
    ):


        end = min(
            start + batch_size,
            total_items,
        )


        batch_items = (
            valid_items[
                start:end
            ]
        )


        texts = [

            item["text"]

            for item
            in batch_items
        ]


        print(
            (
                "Creating local embeddings "
                f"for chunks "
                f"{start + 1}-"
                f"{end} "
                f"of {total_items}"
            ),
            flush=True,
        )


        # ====================================================
        # FASTEMBED BATCH
        # ====================================================

        embeddings = (
            create_embeddings_batch(
                texts
            )
        )


        points: List[
            PointStruct
        ] = []


        # ====================================================
        # CREATE QDRANT POINTS
        # ====================================================

        for (
            item,
            embedding,
        ) in zip(
            batch_items,
            embeddings,
        ):


            source_type = (
                item.get(
                    "source_type",
                    "document",
                )
            )


            repository_id = (
                item.get(
                    "repository_id"
                )
            )


            # GitHub currently passes repository_id
            # as document_id for compatibility.
            source_id = (

                repository_id

                or item[
                    "document_id"
                ]
            )


            point_id = (
                generate_point_id(

                    agent_id=
                        item[
                            "agent_id"
                        ],

                    source_id=
                        source_id,

                    filename=
                        item[
                            "filename"
                        ],

                    chunk_index=
                        item[
                            "chunk_index"
                        ],
                )
            )


            payload: Dict[
                str,
                Any,
            ] = {

                "text":
                    item["text"],

                "content":
                    item["text"],

                "agent_id":
                    item[
                        "agent_id"
                    ],

                "document_id":
                    item[
                        "document_id"
                    ],

                "filename":
                    item[
                        "filename"
                    ],

                "chunk_index":
                    item[
                        "chunk_index"
                    ],

                "source_type":
                    source_type,
            }


            # =================================================
            # GITHUB METADATA
            # =================================================

            if repository_id:

                payload[
                    "repository_id"
                ] = repository_id


            language = (
                item.get(
                    "language"
                )
            )


            if language:

                payload[
                    "language"
                ] = language


            file_path = (
                item.get(
                    "file_path"
                )
            )


            if file_path:

                payload[
                    "file_path"
                ] = file_path


            # =================================================
            # OPTIONAL METADATA
            # =================================================

            metadata = (
                item.get(
                    "metadata"
                )
            )


            if (
                metadata
                and isinstance(
                    metadata,
                    dict,
                )
            ):

                payload.update(
                    metadata
                )


            points.append(

                PointStruct(

                    id=
                        point_id,

                    vector=
                        embedding,

                    payload=
                        payload,
                )
            )


        # ====================================================
        # QDRANT UPSERT WITH RETRIES
        # ====================================================

        max_retries = 7


        batch_successful = False


        for attempt in range(
            1,
            max_retries + 1,
        ):

            try:

                client.upsert(

                    collection_name=
                        QDRANT_COLLECTION,

                    points=
                        points,

                    wait=True,
                )


                batch_successful = True


                break


            except Exception as error:

                print(
                    (
                        "QDRANT BATCH STORE ERROR "
                        f"(attempt "
                        f"{attempt}/"
                        f"{max_retries}):"
                    ),
                    repr(error),
                    flush=True,
                )


                if (
                    attempt
                    == max_retries
                ):

                    print(
                        (
                            "Maximum Qdrant retries "
                            "reached."
                        ),
                        flush=True,
                    )

                    raise


                # Exponential-ish backoff:
                #
                # 3 sec
                # 6 sec
                # 12 sec
                # 20 sec

                wait_seconds = min(
                    3 * (
                        2 **
                        (
                            attempt - 1
                        )
                    ),
                    20,
                )


                print(
                    (
                        "Retrying Qdrant batch in "
                        f"{wait_seconds} seconds..."
                    ),
                    flush=True,
                )


                time.sleep(
                    wait_seconds
                )


        if not batch_successful:

            raise RuntimeError(
                "Qdrant batch failed."
            )


        stored_items += len(
            points
        )


        print(
            (
                "Stored Qdrant batch: "
                f"{stored_items}/"
                f"{total_items}"
            ),
            flush=True,
        )


        # Small pause to avoid hammering
        # remote Qdrant continuously.
        time.sleep(
            0.2
        )


    print(
        (
            "Qdrant batch storage completed: "
            f"{stored_items}/"
            f"{total_items}"
        ),
        flush=True,
    )


    return stored_items


# ============================================================
# STORE MULTIPLE DOCUMENT CHUNKS
# ============================================================

def store_chunks(

    chunks: List[str],

    agent_id: str,

    document_id: str,

    filename: str,

) -> int:


    if not chunks:

        return 0


    chunks_data: List[
        Dict[str, Any]
    ] = []


    for (
        index,
        chunk,
    ) in enumerate(
        chunks
    ):


        clean_chunk = (
            chunk or ""
        ).strip()


        if not clean_chunk:

            continue


        chunks_data.append(
            {

                "text":
                    clean_chunk,

                "agent_id":
                    agent_id,

                "document_id":
                    document_id,

                "filename":
                    filename,

                "chunk_index":
                    index,

                "source_type":
                    "document",
            }
        )


    return store_chunks_batch(

        chunks_data=
            chunks_data,

        batch_size=
            5,
    )


# ============================================================
# SEARCH DOCUMENT / GENERIC CHUNKS
# ============================================================

def search_chunks(

    query: str,

    agent_id: str,

    document_id:
        Optional[str] = None,

    limit: int = 5,

) -> List[
    Dict[str, Any]
]:


    clean_query = (
        query or ""
    ).strip()


    if not clean_query:

        return []


    if not agent_id:

        raise ValueError(
            "agent_id is required."
        )


    ensure_collection()


    client = (
        get_qdrant_client()
    )


    query_vector = (
        create_embedding(
            clean_query
        )
    )


    must_conditions = [

        FieldCondition(

            key=
                "agent_id",

            match=
                MatchValue(
                    value=
                        agent_id
                ),
        )
    ]


    if document_id:

        must_conditions.append(

            FieldCondition(

                key=
                    "document_id",

                match=
                    MatchValue(
                        value=
                            document_id
                    ),
            )
        )


    search_filter = Filter(
        must=
            must_conditions
    )


    try:

        response = (
            client.query_points(

                collection_name=
                    QDRANT_COLLECTION,

                query=
                    query_vector,

                query_filter=
                    search_filter,

                limit=
                    limit,

                with_payload=
                    True,
            )
        )


        points = (
            response.points
        )


    except AttributeError:

        # Compatibility with older clients.
        points = (
            client.search(

                collection_name=
                    QDRANT_COLLECTION,

                query_vector=
                    query_vector,

                query_filter=
                    search_filter,

                limit=
                    limit,

                with_payload=
                    True,
            )
        )


    except Exception as error:

        print(
            "QDRANT SEARCH ERROR:",
            repr(error),
            flush=True,
        )

        raise


    results: List[
        Dict[str, Any]
    ] = []


    for point in points:

        payload = (
            point.payload
            or {}
        )


        content = (

            payload.get(
                "content"
            )

            or payload.get(
                "text"
            )

            or ""
        )


        results.append(
            {

                "content":
                    content,

                "text":
                    content,

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

                "source_type":
                    payload.get(
                        "source_type",
                        "document",
                    ),

                "repository_id":
                    payload.get(
                        "repository_id"
                    ),

                "language":
                    payload.get(
                        "language"
                    ),

                "file_path":
                    payload.get(
                        "file_path"
                    ),

                "score":
                    float(
                        point.score
                    ),
            }
        )


    print(
        (
            f"Retrieved "
            f"{len(results)} chunks"
        ),
        flush=True,
    )


    return results


# ============================================================
# SEARCH GITHUB REPOSITORY
# ============================================================

def search_repository_chunks(

    query: str,

    agent_id: str,

    repository_id: str,

    limit: int = 5,

) -> List[
    Dict[str, Any]
]:


    clean_query = (
        query or ""
    ).strip()


    if not clean_query:

        return []


    if not agent_id:

        raise ValueError(
            "agent_id is required."
        )


    if not repository_id:

        raise ValueError(
            "repository_id is required."
        )


    ensure_collection()


    client = (
        get_qdrant_client()
    )


    query_vector = (
        create_embedding(
            clean_query
        )
    )


    search_filter = Filter(

        must=[

            FieldCondition(

                key=
                    "agent_id",

                match=
                    MatchValue(
                        value=
                            agent_id
                    ),
            ),

            FieldCondition(

                key=
                    "repository_id",

                match=
                    MatchValue(
                        value=
                            repository_id
                    ),
            ),

            FieldCondition(

                key=
                    "source_type",

                match=
                    MatchValue(
                        value=
                            "github"
                    ),
            ),
        ]
    )


    try:

        response = (
            client.query_points(

                collection_name=
                    QDRANT_COLLECTION,

                query=
                    query_vector,

                query_filter=
                    search_filter,

                limit=
                    limit,

                with_payload=
                    True,
            )
        )


        points = (
            response.points
        )


    except AttributeError:

        points = (
            client.search(

                collection_name=
                    QDRANT_COLLECTION,

                query_vector=
                    query_vector,

                query_filter=
                    search_filter,

                limit=
                    limit,

                with_payload=
                    True,
            )
        )


    except Exception as error:

        print(
            "QDRANT GITHUB SEARCH ERROR:",
            repr(error),
            flush=True,
        )

        raise


    results: List[
        Dict[str, Any]
    ] = []


    for point in points:

        payload = (
            point.payload
            or {}
        )


        content = (

            payload.get(
                "content"
            )

            or payload.get(
                "text"
            )

            or ""
        )


        results.append(
            {

                "content":
                    content,

                "text":
                    content,

                "agent_id":
                    payload.get(
                        "agent_id"
                    ),

                "repository_id":
                    payload.get(
                        "repository_id"
                    ),

                "document_id":
                    payload.get(
                        "document_id"
                    ),

                "filename":
                    payload.get(
                        "filename"
                    ),

                "file_path":
                    payload.get(
                        "file_path"
                    ),

                "language":
                    payload.get(
                        "language"
                    ),

                "chunk_index":
                    payload.get(
                        "chunk_index"
                    ),

                "source_type":
                    payload.get(
                        "source_type"
                    ),

                "score":
                    float(
                        point.score
                    ),
            }
        )


    print(
        (
            "Retrieved "
            f"{len(results)} "
            "GitHub chunks"
        ),
        flush=True,
    )


    for result in results:

        print(
            "GITHUB SOURCE:",
            result.get(
                "filename"
            ),
            "score:",
            result.get(
                "score"
            ),
            flush=True,
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


    client = (
        get_qdrant_client()
    )


    delete_filter = Filter(

        must=[

            FieldCondition(

                key=
                    "agent_id",

                match=
                    MatchValue(
                        value=
                            agent_id
                    ),
            ),

            FieldCondition(

                key=
                    "document_id",

                match=
                    MatchValue(
                        value=
                            document_id
                    ),
            ),
        ]
    )


    try:

        client.delete(

            collection_name=
                QDRANT_COLLECTION,

            points_selector=
                FilterSelector(
                    filter=
                        delete_filter
                ),

            wait=True,
        )


        print(
            "Deleted chunks for document:",
            document_id,
            flush=True,
        )


    except Exception as error:

        print(
            "QDRANT DELETE ERROR:",
            repr(error),
            flush=True,
        )

        raise


# ============================================================
# DELETE REPOSITORY CHUNKS
# ============================================================

def delete_repository_chunks(
    repository_id: str,
    agent_id: str,
) -> None:

    if not repository_id:
        raise ValueError(
            "repository_id is required."
        )

    if not agent_id:
        raise ValueError(
            "agent_id is required."
        )

    ensure_collection()

    client = (
        get_qdrant_client()
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
                key="repository_id",
                match=MatchValue(
                    value=repository_id
                ),
            ),
            FieldCondition(
                key="source_type",
                match=MatchValue(
                    value="github"
                ),
            ),
        ]
    )

    try:
        client.delete(
            collection_name=
                QDRANT_COLLECTION,

            points_selector=
                FilterSelector(
                    filter=
                        delete_filter
                ),

            wait=True,
        )

        print(
            (
                "Deleted old GitHub chunks for "
                f"repository: {repository_id}"
            ),
            flush=True,
        )

    except Exception as error:
        print(
            "QDRANT REPOSITORY DELETE ERROR:",
            repr(error),
            flush=True,
        )
        raise


# ============================================================
# QDRANT CONNECTION TEST
# ============================================================

def check_qdrant_connection() -> bool:

    try:

        client = (
            get_qdrant_client()
        )


        client.get_collections()


        print(
            "Qdrant connection successful.",
            flush=True,
        )


        return True


    except Exception as error:

        print(
            "Qdrant connection failed:",
            repr(error),
            flush=True,
        )


        return False