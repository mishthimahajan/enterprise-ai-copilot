from pydantic import BaseModel, Field
from typing import Optional


class AgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class AgentResponse(BaseModel):
    agent_id: str
    name: str
    description: Optional[str] = None
    owner_agent_id: str


class AgentListItem(BaseModel):
    agent_id: str
    name: str
    description: Optional[str] = None