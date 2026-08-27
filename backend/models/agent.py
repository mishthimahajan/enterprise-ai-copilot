from pydantic import BaseModel, Field
from typing import Optional, List


class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = ""


# class AgentResponse(BaseModel):
#     agent_id: str
#     name: str
#     description: Optional[str] = ""
#     owner_id: str
#     members: List[str] = Field(
#         default_factory=list
#     )
class AgentResponse(BaseModel):
    agent_id: str
    name: str
    description: str = ""

    owner_id: Optional[str] = None
    members: list[str] = []

    created_by: Optional[str] = None
    created_by_name: Optional[str] = None

    is_active: bool = True


# class AgentListItem(BaseModel):
#     agent_id: str
#     name: str
#     description: Optional[str] = ""
#     owner_id: str
#     members: List[str] = Field(
#         default_factory=list
#     )

class AgentListItem(BaseModel):
    agent_id: str
    name: str
    description: str = ""

    owner_id: Optional[str] = None
    members: list[str] = []

    created_by: Optional[str] = None
    created_by_name: Optional[str] = None

    is_active: bool = True


class AddMemberRequest(BaseModel):
    user_id: str