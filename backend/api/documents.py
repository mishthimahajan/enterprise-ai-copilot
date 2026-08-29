from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
    Query,
)

from datetime import (
    datetime,
    timezone,
)

from pathlib import Path
import uuid

from database.mongodb import (
    documents_collection,
    agents_collection,
)

from utils.auth import (
    decode_access_token,
)

from services.qdrant_service import (
    create_collection,
    store_chunk,
)

from services.parser import (
    parse_document,
)

from services.chunker import (
    chunk_text,
)


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# =========================================================
# UPLOAD DIRECTORY
# =========================================================

UPLOAD_DIR = Path(
    "uploads/documents"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# AUTHENTICATION HELPER
# =========================================================

def get_authenticated_user_id(
    token: dict,
) -> str:

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

    return user_id


# =========================================================
# VERIFY SHARED AGENT ACCESS
# =========================================================

def verify_agent_access(
    agent_id: str,
):
    """
    Agents are organization-wide shared
    workspaces.

    Any authenticated user may use any
    active shared agent.

    This function only verifies that:
    1. The agent exists.
    2. The agent is active.
    """

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


    return agent


# =========================================================
# GET DOCUMENTS FOR SHARED AGENT
# =========================================================

@router.get("")
def get_documents(
    agent_id: str = Query(...),

    token: dict = Depends(
        decode_access_token
    ),
):

    # Require user to be authenticated.
    get_authenticated_user_id(
        token
    )


    # Shared agent:
    # no owner/member restriction.
    verify_agent_access(
        agent_id
    )


    

    documents = list(
        documents_collection.find(
            {
                "agent_id":
                    agent_id
            }
        ).sort(
            "uploaded_at",
            -1,
        )
    )


    result = []


    for document in documents:

        result.append(
            {
                "id":
                    str(
                        document["_id"]
                    ),

                "document_id":
                    document.get(
                        "document_id"
                    ),

                "name":
                    document.get(
                        "name",
                        "",
                    ),

                "type":
                    document.get(
                        "type",
                        "",
                    ),

                "size":
                    document.get(
                        "size",
                        0,
                    ),

                "status":
                    document.get(
                        "status",
                        "Processing",
                    ),

                "progress":
                    document.get(
                        "progress",
                        0,
                    ),

                "uploaded_at":
                    document.get(
                        "uploaded_at"
                    ),

                "chunks":
                    document.get(
                        "chunks",
                        0,
                    ),

                "agent_id":
                    document.get(
                        "agent_id"
                    ),

                # Audit information only.
                "uploaded_by":
                    document.get(
                        "uploaded_by"
                    ),
            }
        )


    return {
        "documents":
            result,

        "total":
            len(result),

        "indexed":
            sum(
                1
                for doc in result
                if (
                    doc["status"]
                    == "Indexed"
                )
            ),

        "chunks":
            sum(
                doc["chunks"] or 0
                for doc in result
            ),
    }


# =========================================================
# UPLOAD DOCUMENT TO SHARED AGENT
# =========================================================

@router.post("/upload")
async def upload_document(
    agent_id: str = Query(...),

    file: UploadFile = File(...),

    token: dict = Depends(
        decode_access_token
    ),
):

    user_id = (
        get_authenticated_user_id(
            token
        )
    )


    # Shared agent:
    # any authenticated user may upload
    # to any active agent.
    verify_agent_access(
        agent_id
    )


    # =====================================================
    # VALIDATE FILE
    # =====================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail=(
                "Filename is required"
            ),
        )


    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".md",
    }


    extension = Path(
        file.filename
    ).suffix.lower()


    if (
        extension
        not in allowed_extensions
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type"
            ),
        )


    content = (
        await file.read()
    )


    if not content:

        raise HTTPException(
            status_code=400,
            detail=(
                "Uploaded file is empty"
            ),
        )


    # =====================================================
    # SAVE FILE LOCALLY
    # =====================================================

    unique_name = (
        f"{uuid.uuid4()}"
        f"{extension}"
    )


    file_path = (
        UPLOAD_DIR /
        unique_name
    )


    with open(
        file_path,
        "wb",
    ) as buffer:

        buffer.write(
            content
        )


    # =====================================================
    # DOCUMENT ID
    # =====================================================

    document_id = str(
        uuid.uuid4()
    )


    now = datetime.now(
        timezone.utc
    )


    # =====================================================
    # SAVE MONGODB METADATA
    # =====================================================

    document = {

        "document_id":
            document_id,


        # Shared workspace identifier.
        "agent_id":
            agent_id,


        # Audit only:
        # does NOT control visibility.
        "uploaded_by":
            user_id,


        "name":
            file.filename,


        "stored_name":
            unique_name,


        "type":
            extension.replace(
                ".",
                "",
            ).upper(),


        "size":
            len(content),


        "status":
            "Processing",


        "progress":
            0,


        "chunks":
            0,


        "uploaded_at":
            now,


        "file_path":
            str(
                file_path
            ),
    }


    try:

        result = (
            documents_collection.insert_one(
                document
            )
        )

    except Exception as error:

        print(
            "DOCUMENT DATABASE ERROR:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save document metadata"
            ),
        )


    # =====================================================
    # DOCUMENT PROCESSING
    # =====================================================

    try:

        print(
            f"Parsing document: "
            f"{file.filename}",
            flush=True,
        )


        text = parse_document(
            str(
                file_path
            )
        )


        if (
            not text
            or
            not text.strip()
        ):

            documents_collection.update_one(
                {
                    "_id":
                        result.inserted_id
                },
                {
                    "$set": {
                        "status":
                            "Failed",

                        "progress":
                            0,
                    }
                },
            )


            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract "
                    "text from document"
                ),
            )


        # =================================================
        # CHUNK DOCUMENT
        # =================================================

        print(
            "Creating text chunks...",
            flush=True,
        )


        chunks = chunk_text(
            text
        )


        if not chunks:

            documents_collection.update_one(
                {
                    "_id":
                        result.inserted_id
                },
                {
                    "$set": {
                        "status":
                            "Failed",

                        "progress":
                            0,
                    }
                },
            )


            raise HTTPException(
                status_code=400,
                detail=(
                    "No text chunks "
                    "were created"
                ),
            )


        total_chunks = len(
            chunks
        )


        print(
            f"Created "
            f"{total_chunks} "
            f"chunks",
            flush=True,
        )


        # =================================================
        # QDRANT COLLECTION
        # =================================================

        create_collection()


        # =================================================
        # STORE DOCUMENT CHUNKS
        # =================================================

        for (
            index,
            chunk,
        ) in enumerate(
            chunks
        ):


            store_chunk(
                text=
                    chunk,

                agent_id=
                    agent_id,

                document_id=
                    document_id,

                filename=
                    file.filename,

                chunk_index=
                    index,
            )


            progress = int(
                (
                    (index + 1)
                    /
                    total_chunks
                )
                * 100
            )


            documents_collection.update_one(
                {
                    "_id":
                        result.inserted_id
                },
                {
                    "$set": {
                        "progress":
                            progress
                    }
                },
            )


            print(
                f"Indexed chunk "
                f"{index + 1}/"
                f"{total_chunks}",
                flush=True,
            )


        # =================================================
        # MARK DOCUMENT INDEXED
        # =================================================

        documents_collection.update_one(
            {
                "_id":
                    result.inserted_id
            },
            {
                "$set": {

                    "status":
                        "Indexed",

                    "progress":
                        100,

                    "chunks":
                        total_chunks,
                }
            },
        )


        print(
            f"Document indexed "
            f"successfully: "
            f"{file.filename}",
            flush=True,
        )


    except HTTPException:

        raise


    except Exception as error:

        print(
            "DOCUMENT PROCESSING ERROR:",
            repr(error),
            flush=True,
        )


        documents_collection.update_one(
            {
                "_id":
                    result.inserted_id
            },
            {
                "$set": {

                    "status":
                        "Failed",

                    "progress":
                        0,
                }
            },
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Document uploaded "
                "but indexing failed"
            ),
        )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            (
                "Document uploaded and "
                "indexed successfully"
            ),

        "document": {

            "id":
                str(
                    result.inserted_id
                ),

            "document_id":
                document_id,

            "agent_id":
                agent_id,

            "uploaded_by":
                user_id,

            "name":
                file.filename,

            "type":
                extension.replace(
                    ".",
                    "",
                ).upper(),

            "size":
                len(content),

            "status":
                "Indexed",

            "progress":
                100,

            "chunks":
                total_chunks,
        },
    }