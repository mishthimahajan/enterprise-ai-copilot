from datetime import datetime, timezone
from typing import (
    Dict,
    List,
    Optional,
)

from database.mongodb import (
    chat_collection,
)


# =========================================================
# SAVE MESSAGE
# =========================================================

def save_message(
    user_id: str,
    agent_id: str,
    role: str,
    content: str,
    document_id: Optional[str] = None,
    repository_id: Optional[str] = None,
    sources: Optional[List[Dict]] = None,
) -> None:

    if not user_id:
        raise ValueError(
            "user_id is required"
        )

    if not agent_id:
        raise ValueError(
            "agent_id is required"
        )

    if role not in {
        "user",
        "assistant",
    }:
        raise ValueError(
            "role must be 'user' or 'assistant'"
        )

    if not content:
        return

    if (
        document_id
        and
        repository_id
    ):
        raise ValueError(
            "Only one of document_id "
            "or repository_id can be used"
        )

    chat_collection.insert_one(
        {
            "user_id":
                user_id,

            "agent_id":
                agent_id,

            "document_id":
                document_id,

            "repository_id":
                repository_id,

            "role":
                role,

            "content":
                content,

            "sources":
                sources or [],

            "created_at":
                datetime.now(
                    timezone.utc
                ),
        }
    )


# =========================================================
# GET HISTORY
# =========================================================

def get_history(
    user_id: str,
    agent_id: str,
    document_id: Optional[str] = None,
    repository_id: Optional[str] = None,
    limit: int = 10,
) -> List[Dict]:

    if not user_id:
        return []

    if not agent_id:
        return []

    if (
        document_id
        and
        repository_id
    ):
        raise ValueError(
            "Only one of document_id "
            "or repository_id can be used"
        )

    query = {
        "user_id":
            user_id,

        "agent_id":
            agent_id,
    }

    # =====================================================
    # DOCUMENT CHAT
    # =====================================================

    if document_id:

        query[
            "document_id"
        ] = document_id

        query[
            "repository_id"
        ] = None

    # =====================================================
    # REPOSITORY CHAT
    # =====================================================

    elif repository_id:

        query[
            "repository_id"
        ] = repository_id

        query[
            "document_id"
        ] = None

    # =====================================================
    # GENERAL AGENT HISTORY
    # =====================================================

    else:
        pass

    cursor = (
        chat_collection
        .find(
            query,
            {
                "_id":
                    0,

                "role":
                    1,

                "content":
                    1,

                "document_id":
                    1,

                "repository_id":
                    1,

                "sources":
                    1,

                "created_at":
                    1,
            }
        )
        .sort(
            "created_at",
            -1
        )
        .limit(
            limit
        )
    )

    messages = list(
        cursor
    )

    messages.reverse()

    return messages


# =========================================================
# CLEAR HISTORY
# =========================================================

def clear_history(
    user_id: str,
    agent_id: str,
    document_id: Optional[str] = None,
    repository_id: Optional[str] = None,
) -> int:

    if not user_id:
        return 0

    if not agent_id:
        return 0

    if (
        document_id
        and
        repository_id
    ):
        raise ValueError(
            "Only one of document_id "
            "or repository_id can be used"
        )

    query = {
        "user_id":
            user_id,

        "agent_id":
            agent_id,
    }

    # =====================================================
    # DOCUMENT CHAT
    # =====================================================

    if document_id:

        query[
            "document_id"
        ] = document_id

        query[
            "repository_id"
        ] = None

    # =====================================================
    # REPOSITORY CHAT
    # =====================================================

    elif repository_id:

        query[
            "repository_id"
        ] = repository_id

        query[
            "document_id"
        ] = None

    result = (
        chat_collection.delete_many(
            query
        )
    )

    return (
        result.deleted_count
    )