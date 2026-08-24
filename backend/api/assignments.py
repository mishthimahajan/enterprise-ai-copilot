from fastapi import APIRouter, Depends, HTTPException

from database.mongodb import agent_assignments_collection
from database.mongodb import agents_collection

from utils.auth import decode_access_token


router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)


@router.get("")
def get_my_assigned_agents(
    token: dict = Depends(decode_access_token)
):

    user_id = token.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    assignments = list(
        agent_assignments_collection.find(
            {
                "user_id": user_id
            }
        )
    )

    result = []

    for assignment in assignments:

        agent = agents_collection.find_one(
            {
                "agent_id": assignment["agent_id"]
            }
        )

        if agent:

            result.append({
                "agent_id": agent["agent_id"],
                "name": agent.get("name"),
                "description": agent.get("description")
            })

    return {
        "agents": result
    }