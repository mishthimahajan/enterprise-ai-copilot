from fastapi import APIRouter, HTTPException
from database.mongodb import users_collection

import uuid

print("=========== AUTH FILE LOADED ===========")

from models.user import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)

from utils.auth import (
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(
    
    tags=["Authentication"],
)



@router.post("/register")
def register(request: RegisterRequest):

    
    existing_agent = users_collection.find_one(
        {"agent_id": request.agent_id}
    )

    if existing_agent:
        raise HTTPException(
            status_code=400,
            detail="Agent ID already exists"
        )

    
    existing_email = users_collection.find_one(
        {"email": request.email}
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    
    hashed_password = hash_password(request.password)

    user_id = str(uuid.uuid4())
    users_collection.insert_one(
        {     
            "user_id": user_id,
            "name": request.name,

            "email": request.email,
            "agent_id": request.agent_id,
            "password": hashed_password,
            "role": request.role,
        }
    )

    return {
        "message": "User Registered Successfully"
    }



@router.post(
    "/login",
    response_model=TokenResponse
)
def login(request: LoginRequest):

    print("Agent ID:", request.agent_id)

    user = users_collection.find_one(
        {
            "agent_id": request.agent_id
        }
    )

    print("Mongo Result:", user)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Agent ID"
        )

    
    if not verify_password(
        request.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )
    user_id = user.get("user_id")

    if not user_id:
        user_id = str(uuid.uuid4())
        users_collection.update_one(
            {
                "_id": user["_id"]
            },
            {
                "$set":{
                    "user_id":user_id
                }
            }
        )

    token = create_access_token(
        {
            "user_id": user["user_id"],
            "agent_id": user["agent_id"],
            "name": user["name"],
            "role": user["role"],
        }
    )
    print("JWT user_id:",user_id)

    return {
        "access_token": token,
        "token_type": "bearer",
    }