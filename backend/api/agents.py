from datetime import datetime, timezone
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

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
    tags=["Agents"],
)


# =========================================================
# HELPERS
# =========================================================


def get_authenticated_user_id(
    token: dict,
) -> str:
    user_id = token.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )

    return user_id


def serialize_agent(
    agent: dict,
) -> dict:
    """
    Convert MongoDB agent document into
    API response format.
    """

    return {
        "agent_id": agent.get(
            "agent_id",
            "",
        ),

        "name": agent.get(
            "name",
            "",
        ),

        "description": agent.get(
            "description",
            "",
        ),

        # Kept for backward compatibility.
        "owner_id": agent.get(
            "owner_id"
        ),

        "members": agent.get(
            "members",
            [],
        ),

        # Extra fields are useful if your
        # Pydantic models support them.
        "created_by": agent.get(
            "created_by"
        ),

        "created_by_name": agent.get(
            "created_by_name"
        ),

        "is_active": agent.get(
            "is_active",
            True,
        ),
    }


# =========================================================
# CREATE AGENT
# =========================================================


@router.post(
    "/",
    response_model=AgentResponse,
)
def create_agent(
    data: AgentCreate,
    token: dict = Depends(
        decode_access_token
    ),
):
    current_user_id = (
        get_authenticated_user_id(
            token
        )
    )

    clean_name = (
        data.name.strip()
        if data.name
        else ""
    )

    if not clean_name:
        raise HTTPException(
            status_code=400,
            detail="Agent name is required",
        )

    # Find current user so creator name
    # can be stored for audit.
    current_user = (
        users_collection.find_one(
            {
                "user_id":
                    current_user_id
            }
        )
    )

    creator_name = "Unknown"

    if current_user:
        creator_name = (
            current_user.get("name")
            or current_user.get("email")
            or "Unknown"
        )

    agent_id = str(
        uuid.uuid4()
    )

    now = datetime.now(
        timezone.utc
    )

    agent = {
        "agent_id": agent_id,

        "name": clean_name,

        "description": (
            data.description.strip()
            if data.description
            else ""
        ),

        # Keep owner_id for compatibility
        # with your existing member APIs.
        "owner_id":
            current_user_id,

        # New audit fields.
        "created_by":
            current_user_id,

        "created_by_name":
            creator_name,

        # Agents are shared organization-wide.
        "is_active": True,

        "members": [],

        "created_at": now,

        "updated_at": now,
    }

    try:
        agents_collection.insert_one(
            agent
        )

    except Exception as error:
        print(
            "CREATE AGENT ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create agent",
        )

    return serialize_agent(
        agent
    )


# =========================================================
# GET ALL SHARED AGENTS
# =========================================================


@router.get(
    "/",
    response_model=list[AgentListItem],
)
def get_all_agents(
    token: dict = Depends(
        decode_access_token
    ),
):
    """
    Return every active agent to every
    authenticated user.

    Agents are shared organization
    workspaces.
    """

    get_authenticated_user_id(
        token
    )

    try:
        agents = list(
            agents_collection.find(
                {
                    "$or": [
                        {
                            "is_active":
                                True
                        },

                        # Old agents may not
                        # have is_active yet.
                        {
                            "is_active":
                                {
                                    "$exists":
                                        False
                                }
                        },
                    ]
                }
            )
        )

    except Exception as error:
        print(
            "GET AGENTS ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to load agents",
        )

    result = []

    for agent in agents:
        result.append(
            serialize_agent(
                agent
            )
        )

    return result


# =========================================================
# GET SINGLE SHARED AGENT
# =========================================================


@router.get(
    "/{agent_id}",
    response_model=AgentResponse,
)
def get_agent(
    agent_id: str,
    token: dict = Depends(
        decode_access_token
    ),
):
    """
    Any authenticated user can access
    any active agent.
    """

    get_authenticated_user_id(
        token
    )

    agent = (
        agents_collection.find_one(
            {
                "agent_id":
                    agent_id
            }
        )
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    if (
        agent.get(
            "is_active",
            True,
        )
        is False
    ):
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    # IMPORTANT:
    # We intentionally removed the old:
    #
    # owner_id != user_id
    # and user_id not in members
    #
    # restriction because agents are now
    # organization-wide shared workspaces.

    return serialize_agent(
        agent
    )


# =========================================================
# ADD MEMBER
# =========================================================


@router.post(
    "/{agent_id}/members",
    response_model=AgentResponse,
)
def add_member(
    agent_id: str,
    request: AddMemberRequest,
    token: dict = Depends(
        decode_access_token
    ),
):
    """
    Members are still retained for team
    management/auditing.

    Only the creator/owner can add members
    for now.
    """

    current_user_id = (
        get_authenticated_user_id(
            token
        )
    )

    agent = (
        agents_collection.find_one(
            {
                "agent_id":
                    agent_id
            }
        )
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    if (
        agent.get(
            "is_active",
            True,
        )
        is False
    ):
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    # Owner controls membership.
    if (
        agent.get("owner_id")
        != current_user_id
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Only the agent owner "
                "can add members"
            ),
        )

    new_user_id = (
        request.user_id
    )

    if (
        new_user_id
        == current_user_id
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Owner is already associated "
                "with this agent"
            ),
        )

    user = (
        users_collection.find_one(
            {
                "user_id":
                    new_user_id
            }
        )
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    members = agent.get(
        "members",
        [],
    )

    if new_user_id in members:
        raise HTTPException(
            status_code=400,
            detail=(
                "User is already a member"
            ),
        )

    try:
        agents_collection.update_one(
            {
                "agent_id":
                    agent_id
            },
            {
                "$push": {
                    "members":
                        new_user_id
                },

                "$set": {
                    "updated_at":
                        datetime.now(
                            timezone.utc
                        )
                },
            },
        )

    except Exception as error:
        print(
            "ADD MEMBER ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to add member",
        )

    updated_agent = (
        agents_collection.find_one(
            {
                "agent_id":
                    agent_id
            }
        )
    )

    return serialize_agent(
        updated_agent
    )


# =========================================================
# REMOVE MEMBER
# =========================================================


@router.delete(
    "/{agent_id}/members/{user_id}",
    response_model=AgentResponse,
)
def remove_member(
    agent_id: str,
    user_id: str,
    token: dict = Depends(
        decode_access_token
    ),
):
    """
    Only the agent owner can remove
    members.
    """

    current_user_id = (
        get_authenticated_user_id(
            token
        )
    )

    agent = (
        agents_collection.find_one(
            {
                "agent_id":
                    agent_id
            }
        )
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    if (
        agent.get(
            "is_active",
            True,
        )
        is False
    ):
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    if (
        agent.get("owner_id")
        != current_user_id
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Only the agent owner "
                "can remove members"
            ),
        )

    members = agent.get(
        "members",
        [],
    )

    if user_id not in members:
        raise HTTPException(
            status_code=404,
            detail=(
                "User is not a member "
                "of this agent"
            ),
        )

    try:
        agents_collection.update_one(
            {
                "agent_id":
                    agent_id
            },
            {
                "$pull": {
                    "members":
                        user_id
                },

                "$set": {
                    "updated_at":
                        datetime.now(
                            timezone.utc
                        )
                },
            },
        )

    except Exception as error:
        print(
            "REMOVE MEMBER ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to remove member",
        )

    updated_agent = (
        agents_collection.find_one(
            {
                "agent_id":
                    agent_id
            }
        )
    )

    return serialize_agent(
        updated_agent
    )