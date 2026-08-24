from pydantic import BaseModel, Field
from typing import Optional, List


class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class AgentResponse(BaseModel):
    agent_id: str
    name: str
    description: Optional[str] = ""
    owner_id: str
    members: List[str] = Field(
        default_factory=list
    )


class AgentListItem(BaseModel):
    agent_id: str
    name: str
    description: Optional[str] = ""
    owner_id: str
    members: List[str] = Field(
        default_factory=list
    )


class AddMemberRequest(BaseModel):
    user_id: str