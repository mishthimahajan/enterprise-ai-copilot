from fastapi import APIRouter, Depends, HTTPException
import uuid

from database.mongodb import (
    agents_collection,
    users_collection,
)

from utils.auth import decode_access_token

from models.agent import (
    AgentCreate,
    AgentResponse,
    AgentListItem,
    AddMemberRequest,
)


router = APIRouter(
    prefix="/agents",
    tags=["Agents"]
)



# CREATE AGENT


@router.post(
    "/",
    response_model=AgentResponse
)
def create_agent(
    data: AgentCreate,
    token: dict = Depends(decode_access_token)
):

    user_id = token.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # Generate unique agent ID
    agent_id = str(uuid.uuid4())

    agent = {
        "agent_id": agent_id,
        "name": data.name,
        "description": data.description or "",
        "owner_id": user_id,
        "members": []
    }

    agents_collection.insert_one(agent)

    return {
        "agent_id": agent_id,
        "name": data.name,
        "description": data.description or "",
        "owner_id": user_id,
        "members": []
    }



# GET MY AGENTS
#
# Returns:
# 1. Agents owned by current user
# 2. Agents where current user is a member


@router.get(
    "/",
    response_model=list[AgentListItem]
)
def get_my_agents(
    token: dict = Depends(decode_access_token)
):

    user_id = token.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    agents = list(
        agents_collection.find(
            {
                "$or": [
                    {
                        "owner_id": user_id
                    },
                    {
                        "members": user_id
                    }
                ]
            }
        )
    )

    result = []

    for agent in agents:

        result.append({
            "agent_id": agent.get(
                "agent_id"
            ),

            "name": agent.get(
                "name",
                ""
            ),

            "description": agent.get(
                "description",
                ""
            ),

            "owner_id": agent.get(
                "owner_id"
            ),

            "members": agent.get(
                "members",
                []
            )
        })

    return result


# GET SINGLE AGENT


@router.get(
    "/{agent_id}",
    response_model=AgentResponse
)
def get_agent(
    agent_id: str,
    token: dict = Depends(decode_access_token)
):

    user_id = token.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )

    owner_id = agent.get(
        "owner_id"
    )

    members = agent.get(
        "members",
        []
    )

    # Only owner or member can access agent
    if (
        owner_id != user_id
        and user_id not in members
    ):
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this agent"
        )

    return {
        "agent_id": agent.get(
            "agent_id"
        ),

        "name": agent.get(
            "name",
            ""
        ),

        "description": agent.get(
            "description",
            ""
        ),

        "owner_id": owner_id,

        "members": members
    }


# ADD MEMBER
#
# Only the owner can add members.


@router.post(
    "/{agent_id}/members",
    response_model=AgentResponse
)
def add_member(
    agent_id: str,
    request: AddMemberRequest,
    token: dict = Depends(decode_access_token)
):

    current_user_id = token.get(
        "user_id"
    )

    if not current_user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # Find agent
    agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )

    # Only owner can add members
    if agent.get("owner_id") != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="Only the agent owner can add members"
        )

    new_user_id = request.user_id

    # Prevent owner from adding themselves
    if new_user_id == current_user_id:
        raise HTTPException(
            status_code=400,
            detail="Owner is already a member of this agent"
        )

    # Check whether user exists
    user = users_collection.find_one(
        {
            "user_id": new_user_id
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    members = agent.get(
        "members",
        []
    )

    # Prevent duplicate member
    if new_user_id in members:
        raise HTTPException(
            status_code=400,
            detail="User is already a member"
        )

    agents_collection.update_one(
        {
            "agent_id": agent_id
        },
        {
            "$push": {
                "members": new_user_id
            }
        }
    )

  
    updated_agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )

    return {
        "agent_id": updated_agent.get(
            "agent_id"
        ),

        "name": updated_agent.get(
            "name",
            ""
        ),

        "description": updated_agent.get(
            "description",
            ""
        ),

        "owner_id": updated_agent.get(
            "owner_id"
        ),

        "members": updated_agent.get(
            "members",
            []
        )
    }



# REMOVE MEMBER

# Only owner can remove a member.


@router.delete(
    "/{agent_id}/members/{user_id}",
    response_model=AgentResponse
)
def remove_member(
    agent_id: str,
    user_id: str,
    token: dict = Depends(decode_access_token)
):

    current_user_id = token.get(
        "user_id"
    )

    if not current_user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # Find agent
    agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )

    # Only owner can remove members
    if agent.get("owner_id") != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="Only the agent owner can remove members"
        )

    members = agent.get(
        "members",
        []
    )

    if user_id not in members:
        raise HTTPException(
            status_code=404,
            detail="User is not a member of this agent"
        )

    agents_collection.update_one(
        {
            "agent_id": agent_id
        },
        {
            "$pull": {
                "members": user_id
            }
        }
    )

    updated_agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )

    return {
        "agent_id": updated_agent.get(
            "agent_id"
        ),

        "name": updated_agent.get(
            "name",
            ""
        ),

        "description": updated_agent.get(
            "description",
            ""
        ),

        "owner_id": updated_agent.get(
            "owner_id"
        ),

        "members": updated_agent.get(
            "members",
            []
        )
    }