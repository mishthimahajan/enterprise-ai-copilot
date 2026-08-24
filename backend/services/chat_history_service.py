from datetime import datetime, timezone
from typing import List, Dict, Optional

from database.mongodb import chat_collection


def save_message(
    user_id: str,
    agent_id: str,
    role: str,
    content: str,
    document_id: Optional[str] = None,
) -> None:

    if not user_id:
        raise ValueError("user_id is required")

    if not agent_id:
        raise ValueError("agent_id is required")

    if role not in {"user", "assistant"}:
        raise ValueError(
            "role must be 'user' or 'assistant'"
        )

    if not content:
        return

    chat_collection.insert_one(
        {
            "user_id": user_id,
            "agent_id": agent_id,
            "document_id": document_id,
            "role": role,
            "content": content,
            "created_at": datetime.now(
                timezone.utc
            ),
        }
    )


def get_history(
    user_id: str,
    agent_id: str,
    document_id: Optional[str] = None,
    limit: int = 10,
) -> List[Dict]:

    if not user_id:
        return []

    if not agent_id:
        return []

    query = {
        "user_id": user_id,
        "agent_id": agent_id,
    }

    if document_id:
        query["document_id"] = document_id

    cursor = (
        chat_collection
        .find(
            query,
            {
                "_id": 0,
                "role": 1,
                "content": 1,
                "document_id": 1,
                "created_at": 1,
            }
        )
        .sort(
            "created_at",
            -1
        )
        .limit(limit)
    )

    messages = list(cursor)

    # MongoDB returns newest first.
    # Reverse for normal chat order:
    # oldest -> newest
    messages.reverse()

    return messages


def clear_history(
    user_id: str,
    agent_id: str,
    document_id: Optional[str] = None,
) -> int:

    query = {
        "user_id": user_id,
        "agent_id": agent_id,
    }

    if document_id:
        query["document_id"] = document_id

    result = chat_collection.delete_many(
        query
    )

    return result.deleted_count
