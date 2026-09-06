# from fastapi import APIRouter, HTTPException
# from database.mongodb import users_collection

# import uuid

# print("=========== AUTH FILE LOADED ===========")

# from models.user import (
#     RegisterRequest,
#     LoginRequest,
#     TokenResponse,
# )

# from utils.auth import (
#     create_access_token,
#     hash_password,
#     verify_password,
# )

# router = APIRouter(
    
#     tags=["Authentication"],
# )



# @router.post("/register")
# def register(request: RegisterRequest):

    
#     existing_agent = users_collection.find_one(
#         {"agent_id": request.agent_id}
#     )

#     if existing_agent:
#         raise HTTPException(
#             status_code=400,
#             detail="Agent ID already exists"
#         )

    
#     existing_email = users_collection.find_one(
#         {"email": request.email}
#     )

#     if existing_email:
#         raise HTTPException(
#             status_code=400,
#             detail="Email already registered"
#         )

    
#     hashed_password = hash_password(request.password)

#     user_id = str(uuid.uuid4())
#     users_collection.insert_one(
#         {     
#             "user_id": user_id,
#             "name": request.name,

#             "email": request.email,
#             "agent_id": request.agent_id,
#             "password": hashed_password,
#             "role": request.role,
#         }
#     )

#     return {
#         "message": "User Registered Successfully"
#     }



# @router.post(
#     "/login",
#     response_model=TokenResponse
# )
# def login(request: LoginRequest):

#     print("Agent ID:", request.agent_id)

#     user = users_collection.find_one(
#         {
#             "agent_id": request.agent_id
#         }
#     )

#     print("Mongo Result:", user)

#     if not user:
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid Agent ID"
#         )

    
#     if not verify_password(
#         request.password,
#         user["password"]
#     ):
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid Password"
#         )
#     user_id = user.get("user_id")

#     if not user_id:
#         user_id = str(uuid.uuid4())
#         users_collection.update_one(
#             {
#                 "_id": user["_id"]
#             },
#             {
#                 "$set":{
#                     "user_id":user_id
#                 }
#             }
#         )

#     token = create_access_token(
#         {
#             "user_id": user["user_id"],
#             "agent_id": user["agent_id"],
#             "name": user["name"],
#             "role": user["role"],
#         }
#     )
#     print("JWT user_id:",user_id)

#     return {
#         "access_token": token,
#         "token_type": "bearer",
#     }


from datetime import datetime, timedelta, timezone
import hashlib
import secrets
import uuid

from fastapi import APIRouter, HTTPException

from database.mongodb import users_collection

from models.user import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from utils.auth import (
    create_access_token,
    hash_password,
    verify_password,
)


print("=========== AUTH FILE LOADED ===========")


router = APIRouter(
    tags=["Authentication"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(request: RegisterRequest):

    existing_agent = users_collection.find_one(
        {
            "agent_id": request.agent_id
        }
    )

    if existing_agent:
        raise HTTPException(
            status_code=400,
            detail="Agent ID already exists"
        )

    existing_email = users_collection.find_one(
        {
            "email": request.email.lower()
        }
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        request.password
    )

    user_id = str(
        uuid.uuid4()
    )

    users_collection.insert_one(
        {
            "user_id": user_id,
            "name": request.name,
            "email": request.email.lower(),
            "agent_id": request.agent_id,
            "password": hashed_password,
            "role": request.role,
        }
    )

    return {
        "message": "User Registered Successfully"
    }


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(request: LoginRequest):

    print(
        "Agent ID:",
        request.agent_id
    )

    user = users_collection.find_one(
        {
            "agent_id": request.agent_id
        }
    )

    print(
        "Mongo Result:",
        user
    )

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

    user_id = user.get(
        "user_id"
    )

    if not user_id:
        user_id = str(
            uuid.uuid4()
        )

        users_collection.update_one(
            {
                "_id": user["_id"]
            },
            {
                "$set": {
                    "user_id": user_id
                }
            }
        )

    token = create_access_token(
        {
            "user_id": user_id,
            "agent_id": user["agent_id"],
            "name": user["name"],
            "role": user["role"],
        }
    )

    print(
        "JWT user_id:",
        user_id
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest
):

    clean_agent_id = (
        request.agent_id
        .strip()
    )

    clean_email = (
        str(request.email)
        .strip()
        .lower()
    )

    user = users_collection.find_one(
        {
            "agent_id": clean_agent_id,
            "email": clean_email,
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail=(
                "No account found with this "
                "Agent ID and email."
            )
        )

    # Generate secure reset token
    raw_token = secrets.token_urlsafe(
        32
    )

    # Store only token hash in MongoDB
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    expires_at = (
        datetime.now(
            timezone.utc
        )
        + timedelta(
            minutes=15
        )
    )

    users_collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "password_reset_token_hash":
                    token_hash,

                "password_reset_expires_at":
                    expires_at,
            }
        }
    )

    return {
        "message":
            "Account verified successfully.",

        "reset_token":
            raw_token,

        "expires_in_minutes":
            15,
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest
):

    if (
        len(request.new_password)
        < 6
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least "
                "6 characters."
            )
        )

    if not request.reset_token:
        raise HTTPException(
            status_code=400,
            detail="Reset token is required."
        )

    token_hash = hashlib.sha256(
        request.reset_token.encode(
            "utf-8"
        )
    ).hexdigest()

    user = users_collection.find_one(
        {
            "password_reset_token_hash":
                token_hash
        }
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid or already used "
                "reset token."
            )
        )

    expires_at = user.get(
        "password_reset_expires_at"
    )

    if not expires_at:
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired."
        )

    # PyMongo can return naive datetime
    if expires_at.tzinfo is None:
        expires_at = (
            expires_at.replace(
                tzinfo=timezone.utc
            )
        )

    if (
        datetime.now(
            timezone.utc
        )
        > expires_at
    ):

        users_collection.update_one(
            {
                "_id": user["_id"]
            },
            {
                "$unset": {
                    "password_reset_token_hash":
                        "",

                    "password_reset_expires_at":
                        "",
                }
            }
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Reset token has expired. "
                "Please request a new one."
            )
        )

    new_hashed_password = hash_password(
        request.new_password
    )

    users_collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "password":
                    new_hashed_password
            },

            "$unset": {
                "password_reset_token_hash":
                    "",

                "password_reset_expires_at":
                    "",
            }
        }
    )

    return {
        "message":
            "Password reset successfully."
    }