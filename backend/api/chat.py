from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from utils.auth import (
    decode_access_token,
)

from services.qdrant_service import (
    search_chunks,
    search_repository_chunks,
)

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
    repositories_collection,
)


# =========================================================
# ROUTER
# =========================================================

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

    # Document chat
    document_id: Optional[str] = None

    # GitHub repository chat
    repository_id: Optional[str] = None


# =========================================================
# SOURCE MODEL
# =========================================================

class ChatSource(BaseModel):
    filename: Optional[str] = None
    file_path: Optional[str] = None

    document_id: Optional[str] = None
    repository_id: Optional[str] = None

    language: Optional[str] = None
    source_type: Optional[str] = None

    chunk_index: Optional[int] = None
    score: Optional[float] = None

    source_url: Optional[str] = None



# =========================================================
# CHAT RESPONSE
# =========================================================

class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource] = []


# =========================================================
# HISTORY MODELS
# =========================================================

class HistoryMessage(BaseModel):
    role: str
    content: str
    sources: List[ChatSource] = []


class ChatHistoryResponse(BaseModel):
    messages: List[HistoryMessage]


# =========================================================
# VERIFY AGENT ACCESS
# =========================================================

def verify_agent_access(
    agent_id: str,
    user_id: str,
):
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )

    agent = agents_collection.find_one(
        {
            "agent_id": agent_id,
        }
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    if agent.get(
        "is_active",
        True,
    ) is False:
        raise HTTPException(
            status_code=403,
            detail="This agent is inactive",
        )

    # Shared organization agent:
    # any authenticated organization user
    # can use an active shared agent.
    return agent


# =========================================================
# VERIFY REPOSITORY
# =========================================================

def verify_repository(
    repository_id: str,
    agent_id: str,
):
    repository = (
        repositories_collection.find_one(
            {
                "repository_id": repository_id,
                "agent_id": agent_id,
            }
        )
    )

    if not repository:
        raise HTTPException(
            status_code=404,
            detail=(
                "Repository not found "
                "for selected agent"
            ),
        )

    status = repository.get(
        "status"
    )

    if status != "Indexed":
        raise HTTPException(
            status_code=400,
            detail=(
                "Repository is not indexed yet"
            ),
        )

    return repository


# =========================================================
# NORMALIZE OPTIONAL ID
# =========================================================

def normalize_optional_id(
    value: Optional[str],
) -> Optional[str]:

    if not value:
        return None

    value = value.strip()

    if not value:
        return None

    return value


# =========================================================
# POST /chat
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

    # =====================================================
    # QUESTION
    # =====================================================

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )


    # =====================================================
    # USER
    # =====================================================

    user_id = token.get(
        "user_id"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )


    # =====================================================
    # AGENT
    # =====================================================

    agent_id = request.agent_id.strip()

    if not agent_id:
        raise HTTPException(
            status_code=400,
            detail="Agent ID is required",
        )

    verify_agent_access(
        agent_id=agent_id,
        user_id=user_id,
    )


    # =====================================================
    # NORMALIZE KNOWLEDGE SOURCE IDS
    # =====================================================

    document_id = normalize_optional_id(
        request.document_id
    )

    repository_id = normalize_optional_id(
        request.repository_id
    )


    # =====================================================
    # REQUIRE ONE KNOWLEDGE SOURCE
    # =====================================================

    if (
        not document_id
        and
        not repository_id
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Please select a document "
                "or repository first."
            ),
        )

    if (
        document_id
        and
        repository_id
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Select either a document "
                "or repository, not both."
            ),
        )


    try:

        # =================================================
        # VERIFY REPOSITORY
        # =================================================
        repository = None
        if repository_id:
            verify_repository(
                repository_id=repository_id,
                agent_id=agent_id,
            )


        # =================================================
        # LOAD CHAT HISTORY
        # =================================================

        if repository_id:

            history = get_history(
                user_id=user_id,
                agent_id=agent_id,
                document_id=None,
                repository_id=repository_id,
                limit=10,
            )

        elif document_id:

            history = get_history(
                user_id=user_id,
                agent_id=agent_id,
                document_id=document_id,
                repository_id=None,
                limit=10,
            )

        else:

            history = []


        print(
            (
                f"Loaded {len(history)} "
                f"previous chat messages"
            ),
            flush=True,
        )


        # =================================================
        # RETRIEVE KNOWLEDGE
        # =================================================

        # -------------------------------------------------
        # GITHUB REPOSITORY MODE
        # -------------------------------------------------

        if repository_id:

            print(
                "CHAT MODE: GITHUB REPOSITORY",
                flush=True,
            )

            print(
                "Repository ID:",
                repository_id,
                flush=True,
            )

            context = search_repository_chunks(
                query=question,
                agent_id=agent_id,
                repository_id=repository_id,
                limit=5,
            )


        # -------------------------------------------------
        # DOCUMENT MODE
        # -------------------------------------------------

        elif document_id:

            print(
                "CHAT MODE: DOCUMENT",
                flush=True,
            )

            print(
                "Document ID:",
                document_id,
                flush=True,
            )

            context = search_chunks(
                query=question,
                agent_id=agent_id,
                document_id=document_id,
                limit=5,
            )


        else:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Please select a document "
                    "or repository first."
                ),
            )


        # =================================================
        # CHECK RETRIEVAL
        # =================================================

        print(
            (
                f"Retrieved {len(context)} "
                f"chunks"
            ),
            flush=True,
        )

        if not context:

            if repository_id:

                raise HTTPException(
                    status_code=404,
                    detail=(
                        "No relevant repository "
                        "content was found."
                    ),
                )

            raise HTTPException(
                status_code=404,
                detail=(
                    "No relevant document "
                    "content was found."
                ),
            )


        # =================================================
        # LOG SOURCES
        # =================================================

        for item in context:

            print(
                "SOURCE:",
                (
                    item.get("file_path")
                    or
                    item.get("filename")
                ),
                "score:",
                item.get("score"),
                flush=True,
            )


        # =================================================
        # GENERATE ANSWER
        # =================================================

        answer = generate_answer(
            question=question,
            context=context,
            history=history,
        )


        # =================================================
        # CREATE SOURCES
        # =================================================
        #
        # IMPORTANT:
        # Build sources BEFORE saving messages.
        # =================================================

        sources = []

        for item in context:

            source = {
                "filename":
                    item.get(
                        "filename"
                    ),

                "file_path":
                    item.get(
                        "file_path"
                    ),

                "document_id":
                    item.get(
                        "document_id"
                    ),

                "repository_id":
                    item.get(
                        "repository_id"
                    ),

                "language":
                    item.get(
                        "language"
                    ),

                "source_type":
                    item.get(
                        "source_type"
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

            sources.append(
                source
            )


        # =================================================
        # SAVE USER MESSAGE
        # =================================================
        #
        # User message has no retrieved sources.
        # =================================================

        save_message(
            user_id=user_id,
            agent_id=agent_id,
            role="user",
            content=question,
            document_id=document_id,
            repository_id=repository_id,
            sources=[],
        )


        # =================================================
        # SAVE ASSISTANT MESSAGE
        # =================================================
        #
        # Assistant answer stores retrieved sources.
        # This allows sources to survive page refresh.
        # =================================================

        save_message(
            user_id=user_id,
            agent_id=agent_id,
            role="assistant",
            content=answer,
            document_id=document_id,
            repository_id=repository_id,
            sources=sources,
        )


        print(
            "Chat messages saved successfully",
            flush=True,
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
            flush=True,
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
    repository_id: Optional[str] = None,
    token: dict = Depends(
        decode_access_token
    ),
):

    # =====================================================
    # USER
    # =====================================================

    user_id = token.get(
        "user_id"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )


    # =====================================================
    # NORMALIZE
    # =====================================================

    agent_id = agent_id.strip()

    document_id = normalize_optional_id(
        document_id
    )

    repository_id = normalize_optional_id(
        repository_id
    )


    if not agent_id:
        raise HTTPException(
            status_code=400,
            detail="Agent ID is required",
        )


    # =====================================================
    # ACCESS
    # =====================================================

    verify_agent_access(
        agent_id=agent_id,
        user_id=user_id,
    )


    # =====================================================
    # DO NOT ALLOW BOTH
    # =====================================================

    if (
        document_id
        and
        repository_id
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Select either a document "
                "or repository, not both."
            ),
        )


    try:

        # =================================================
        # LOAD HISTORY
        # =================================================

        history = get_history(
            user_id=user_id,
            agent_id=agent_id,
            document_id=document_id,
            repository_id=repository_id,
            limit=50,
        )


        print(
            (
                f"Loaded {len(history)} "
                f"history messages"
            ),
            flush=True,
        )


        # =================================================
        # NORMALIZE RESPONSE
        # =================================================

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
                and
                content
            ):

                raw_sources = item.get(
                    "sources",
                    [],
                )

                if not isinstance(
                    raw_sources,
                    list,
                ):
                    raw_sources = []


                messages.append(
                    {
                        "role":
                            role,

                        "content":
                            content,

                        "sources":
                            raw_sources,
                    }
                )


        return {
            "messages":
                messages,
        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "CHAT HISTORY ERROR:",
            repr(error),
            flush=True,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to load "
                "chat history."
            ),
        )


# =========================================================
# DELETE CHAT HISTORY
# =========================================================

@router.delete(
    "/history/{agent_id}",
)
def delete_chat_history(
    agent_id: str,
    document_id: Optional[str] = None,
    repository_id: Optional[str] = None,
    token: dict = Depends(
        decode_access_token
    ),
):

    # =====================================================
    # USER
    # =====================================================

    user_id = token.get(
        "user_id"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )


    # =====================================================
    # NORMALIZE
    # =====================================================

    agent_id = agent_id.strip()

    document_id = normalize_optional_id(
        document_id
    )

    repository_id = normalize_optional_id(
        repository_id
    )


    if not agent_id:
        raise HTTPException(
            status_code=400,
            detail="Agent ID is required",
        )


    # =====================================================
    # ACCESS
    # =====================================================

    verify_agent_access(
        agent_id=agent_id,
        user_id=user_id,
    )


    # =====================================================
    # DO NOT ALLOW BOTH
    # =====================================================

    if (
        document_id
        and
        repository_id
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Select either a document "
                "or repository, not both."
            ),
        )


    try:

        # =================================================
        # CLEAR CORRECT HISTORY
        # =================================================

        deleted_count = clear_history(
            user_id=user_id,
            agent_id=agent_id,
            document_id=document_id,
            repository_id=repository_id,
        )


        return {
            "message":
                "Chat history cleared successfully",

            "deleted_count":
                deleted_count,
        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "CLEAR CHAT ERROR:",
            repr(error),
            flush=True,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to clear "
                "chat history"
            ),
        )