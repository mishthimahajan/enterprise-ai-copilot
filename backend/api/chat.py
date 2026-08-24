from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import BaseModel, Field
from typing import List, Optional

from utils.auth import decode_access_token

from services.qdrant_service import search_chunks

from services.chat_service import (
    generate_answer,
)

from services.chat_history_service import (
    get_history,
    save_message,
    clear_history,
)

from database.mongodb import (
    agents_collection,
)


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class ChatRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=1,
    )

    agent_id: str

    document_id: Optional[str] = None


# =========================================================
# SOURCE MODEL
# =========================================================

class ChatSource(BaseModel):

    filename: Optional[str] = None

    document_id: Optional[str] = None

    chunk_index: Optional[int] = None

    score: Optional[float] = None


# =========================================================
# RESPONSE MODEL
# =========================================================

class ChatResponse(BaseModel):

    answer: str

    sources: List[ChatSource] = []


# =========================================================
# CHAT HISTORY RESPONSE
# =========================================================

class HistoryMessage(BaseModel):

    role: str

    content: str


class ChatHistoryResponse(BaseModel):

    messages: List[HistoryMessage]


# =========================================================
# VERIFY AGENT ACCESS
# =========================================================

def verify_agent_access(
    agent_id: str,
    user_id: str,
):

    agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )


    if not agent:

        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )


    owner_id = agent.get(
        "owner_id"
    )

    members = agent.get(
        "members",
        []
    )


    # Owner has access
    if owner_id == user_id:

        return agent


    # Agent member has access
    if user_id in members:

        return agent


    raise HTTPException(
        status_code=403,
        detail=(
            "You do not have access "
            "to this agent"
        ),
    )


# =========================================================
# CHAT ENDPOINT
# =========================================================

@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,

    token: dict = Depends(
        decode_access_token
    ),
):

    # -----------------------------------------------------
    # VALIDATE QUESTION
    # -----------------------------------------------------

    question = (
        request.question.strip()
    )


    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )


    # -----------------------------------------------------
    # GET LOGGED-IN USER
    # -----------------------------------------------------

    user_id = token.get(
        "user_id"
    )


    if not user_id:

        raise HTTPException(
            status_code=401,
            detail=(
                "Invalid authentication token"
            ),
        )


    # -----------------------------------------------------
    # VALIDATE AGENT ID
    # -----------------------------------------------------

    agent_id = (
        request.agent_id.strip()
    )


    if not agent_id:

        raise HTTPException(
            status_code=400,
            detail="Agent ID is required",
        )


    # -----------------------------------------------------
    # VERIFY USER CAN ACCESS AGENT
    # -----------------------------------------------------

    verify_agent_access(
        agent_id=agent_id,
        user_id=user_id,
    )


    try:

        # =================================================
        # LOAD PREVIOUS CHAT HISTORY
        # =================================================

        history = get_history(
            user_id=user_id,
            agent_id=agent_id,
            limit=10,
        )


        print(
            f"Loaded {len(history)} "
            f"previous chat messages"
        )


        # =================================================
        # SEARCH QDRANT
        # =================================================

        context = search_chunks(
            query=question,
            agent_id=agent_id,
            document_id=(
                request.document_id
            ),
            limit=5,
        )


        print(
            f"Retrieved "
            f"{len(context)} chunks"
        )


        # Debug sources

        for item in context:

            print(
                "SOURCE:",
                item.get(
                    "filename"
                ),
                "score:",
                item.get(
                    "score"
                ),
            )


        # =================================================
        # GENERATE RAG ANSWER
        # =================================================

        answer = generate_answer(
            question=question,
            context=context,
            history=history,
        )


        # =================================================
        # SAVE USER MESSAGE
        # =================================================

        save_message(
            user_id=user_id,
            agent_id=agent_id,
            document_id=request.document_id,
            role="user",
            content=question,
        )


        # =================================================
        # SAVE ASSISTANT MESSAGE
        # =================================================

        save_message(
            user_id=user_id,
            agent_id=agent_id,
            document_id=request.document_id,
            role="assistant",
            content=answer,
        )


        # =================================================
        # FORMAT SOURCES
        # =================================================

        sources = []


        for item in context:

            sources.append(
                {
                    "filename":
                        item.get(
                            "filename"
                        ),

                    "document_id":
                        item.get(
                            "document_id"
                        ),

                    "chunk_index":
                        item.get(
                            "chunk_index"
                        ),

                    "score":
                        item.get(
                            "score"
                        ),
                }
            )


        # =================================================
        # RESPONSE
        # =================================================

        return {
            "answer": answer,
            "sources": sources,
        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "CHAT ERROR:",
            repr(error),
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to process "
                "chat request"
            ),
        )


# =========================================================
# GET CHAT HISTORY
# =========================================================

@router.get(
    "/history/{agent_id}",
    response_model=ChatHistoryResponse,
)
def chat_history(
    agent_id: str,
    document_id: Optional[str] = None,
    token: dict = Depends(
        decode_access_token
    ),
):

    # -----------------------------------------------------
    # GET LOGGED-IN USER
    # -----------------------------------------------------

    user_id = token.get(
        "user_id"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )

    # -----------------------------------------------------
    # VALIDATE AGENT
    # -----------------------------------------------------

    if not agent_id.strip():
        raise HTTPException(
            status_code=400,
            detail="Agent ID is required",
        )

    # -----------------------------------------------------
    # VERIFY USER HAS ACCESS TO AGENT
    # -----------------------------------------------------

    verify_agent_access(
        agent_id=agent_id,
        user_id=user_id,
    )

    try:

        # -------------------------------------------------
        # LOAD HISTORY
        # -------------------------------------------------

        history = get_history(
            user_id=user_id,
            agent_id=agent_id,
            document_id=document_id,
            limit=50,
        )

        print(
            f"Loaded {len(history)} "
            f"history messages"
        )

        # -------------------------------------------------
        # FORMAT HISTORY FOR FRONTEND
        # -------------------------------------------------

        messages = []

        for item in history:

            role = item.get(
                "role"
            )

            content = item.get(
                "content"
            )

            if (
                role in [
                    "user",
                    "assistant",
                ]
                and content
            ):
                messages.append(
                    {
                        "role": role,
                        "content": content,
                    }
                )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {
            "messages": messages
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "CHAT HISTORY ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to load "
                "chat history."
            ),
        )


@router.delete(
    "/history/{agent_id}",
)
def delete_chat_history(
    agent_id: str,
    document_id: Optional[str] = None,
    token: dict = Depends(
        decode_access_token
    ),
):
    user_id = token.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )

    verify_agent_access(
        agent_id=agent_id,
        user_id=user_id,
    )

    try:
        deleted_count = clear_history(
            user_id=user_id,
            agent_id=agent_id,
            document_id=document_id,
        )

        return {
            "message": "Chat history cleared successfully",
            "deleted_count": deleted_count,
        }

    except Exception as error:
        print(
            "CLEAR CHAT ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to clear chat history",
        )