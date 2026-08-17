from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import uuid

from database.mongodb import users_collection
from models.agent import (
    AgentCreate,
    AgentResponse,
    AgentListItem,
)
from utils.auth import decode_access_token


router = APIRouter(
    prefix="/agents",
    tags=["Agents"]
)




@router.post("/", response_model=AgentResponse)
def create_agent(
    request: AgentCreate,
    current_user: dict = Depends(decode_access_token)
):
    """
    Create an AI agent for the logged-in user.
    """

    owner_agent_id = current_user.get("agent_id")

    if not owner_agent_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    
    new_agent_id = f"agent-{uuid.uuid4().hex[:12]}"

    agent = {
        "agent_id": new_agent_id,
        "name": request.name,
        "description": request.description,
        "owner_agent_id": owner_agent_id,
        "created_at": datetime.utcnow(),
    }

    users_collection.insert_one(agent)

    return {
        "agent_id": new_agent_id,
        "name": request.name,
        "description": request.description,
        "owner_agent_id": owner_agent_id,
    }



@router.get("/", response_model=list[AgentListItem])
def get_my_agents(
    current_user: dict = Depends(decode_access_token)
):
    """
    Return agents belonging to the logged-in user.
    """

    owner_agent_id = current_user.get("agent_id")

    if not owner_agent_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    agents = users_collection.find(
        {
            "owner_agent_id": owner_agent_id
        }
    )

    result = []

    for agent in agents:
        result.append({
            "agent_id": agent["agent_id"],
            "name": agent["name"],
            "description": agent.get("description"),
        })

    return result




@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(
    agent_id: str,
    current_user: dict = Depends(decode_access_token)
):
    """
    Get a specific agent only if it belongs to the logged-in user.
    """

    owner_agent_id = current_user.get("agent_id")

    agent = users_collection.find_one({
        "agent_id": agent_id,
        "owner_agent_id": owner_agent_id
    })

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )

    return {
        "agent_id": agent["agent_id"],
        "name": agent["name"],
        "description": agent.get("description"),
        "owner_agent_id": agent["owner_agent_id"],
    }