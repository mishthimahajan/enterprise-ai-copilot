from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    agent_id: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    role: str


class LoginRequest(BaseModel):
    agent_id: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    name: str
    email: str
    agent_id: str
    role: str