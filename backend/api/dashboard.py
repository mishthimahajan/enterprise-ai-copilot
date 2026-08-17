from fastapi import APIRouter, Depends, HTTPException

from database.mongodb import users_collection
from utils.auth import decode_access_token


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("")
def get_dashboard(
    token: dict = Depends(decode_access_token)
):

    agent_id = token.get("agent_id")

    if not agent_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    user = users_collection.find_one(
        {"agent_id": agent_id}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user": {
            "name": user.get("name"),
            "agent_id": user.get("agent_id"),
            "role": user.get("role"),
        },
        "stats": {
            "repositories": 0,
            "documents": 0,
            "ai_chats": 0,
            "analyses": 0,
        },
        "repository": None,
        "recent_activity": [],
    }