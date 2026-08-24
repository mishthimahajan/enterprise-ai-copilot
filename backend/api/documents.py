from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
    Query
)

from datetime import datetime, timezone
from pathlib import Path
import uuid

from database.mongodb import documents_collection, agents_collection
from utils.auth import decode_access_token

from services.qdrant_service import (
    create_collection,
    store_chunk
)

from services.parser import parse_document
from services.chunker import chunk_text


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_DIR = Path("uploads/documents")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)




def verify_agent_access(
    agent_id: str,
    user_id: str
):

    agent = agents_collection.find_one(
        {
            "agent_id": agent_id
        }
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
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

    # Member has access
    if user_id in members:
        return agent

    raise HTTPException(
        status_code=403,
        detail="You are not a member of this agent"
    )




@router.get("")
def get_documents(
    agent_id: str = Query(...),
    token: dict = Depends(
        decode_access_token
    )
):

    user_id = token.get(
        "user_id"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    
    verify_agent_access(
        agent_id,
        user_id
    )

    documents = list(
        documents_collection.find(
            {
                "agent_id": agent_id
            }
        ).sort(
            "uploaded_at",
            -1
        )
    )

    result = []

    for document in documents:

        result.append({

            "id": str(
                document["_id"]
            ),

            "document_id": document.get(
                "document_id"
            ),

            "name": document.get(
                "name"
            ),

            "type": document.get(
                "type"
            ),

            "size": document.get(
                "size",
                0
            ),

            "status": document.get(
                "status",
                "Processing"
            ),

            "progress": document.get(
                "progress",
                0
            ),

            "uploaded_at": document.get(
                "uploaded_at"
            ),

            "chunks": document.get(
                "chunks",
                0
            ),

            "agent_id": document.get(
                "agent_id"
            )
        })

    return {
        "documents": result,
        "total": len(result),

        "indexed": sum(
            1
            for doc in result
            if doc["status"] == "Indexed"
        ),

        "chunks": sum(
            doc["chunks"] or 0
            for doc in result
        )
    }




@router.post("/upload")
async def upload_document(
    agent_id: str = Query(...),
    file: UploadFile = File(...),
    token: dict = Depends(
        decode_access_token
    )
):

    user_id = token.get(
        "user_id"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    

    verify_agent_access(
        agent_id,
        user_id
    )

    

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Filename is required"
        )

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".md"
    }

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    content = await file.read()

    if not content:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    

    unique_name = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = (
        UPLOAD_DIR / unique_name
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(content)

   #document id

    document_id = str(
        uuid.uuid4()
    )

    now = datetime.now(
        timezone.utc
    )
     #mongodb

    document = {

        "document_id":
            document_id,

        # VERY IMPORTANT
        # Store SHARED AGENT ID here
        "agent_id":
            agent_id,

        # User who uploaded it
        "uploaded_by":
            user_id,

        "name":
            file.filename,

        "stored_name":
            unique_name,

        "type":
            extension.replace(
                ".",
                ""
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
            str(file_path)
    }

    result = documents_collection.insert_one(
        document
    )

   #document process

    try:

        print(
            f"Parsing document: {file.filename}"
        )

        text = parse_document(
            str(file_path)
        )

        if not text or not text.strip():

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
                            0
                    }
                }
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract "
                    "text from document"
                )
            )

        #chunk document

        print(
            "Creating text chunks..."
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
                            0
                    }
                }
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    "No text chunks "
                    "were created"
                )
            )

        total_chunks = len(
            chunks
        )

        print(
            f"Created {total_chunks} chunks"
        )

        #qdrant collection

        create_collection()

       #store chunks

        for index, chunk in enumerate(
            chunks
        ):

            store_chunk(

                text=chunk,

                
                agent_id=agent_id,

                document_id=document_id,

                filename=file.filename,

                chunk_index=index
            )

            progress = int(
                (
                    (index + 1)
                    / total_chunks
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
                }
            )

            print(
                f"Indexed chunk "
                f"{index + 1}/"
                f"{total_chunks}"
            )

       #as indexed

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
                        total_chunks
                }
            }
        )

        print(
            f"Document indexed successfully: "
            f"{file.filename}"
        )

    except HTTPException:

        raise

    except Exception as e:

        print(
            "Document processing error:",
            repr(e)
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
                        0
                }
            }
        )

        raise HTTPException(

            status_code=500,

            detail=(
                "Document uploaded but "
                "indexing failed"
            )
        )

   #response

    return {

        "message":
            "Document uploaded and "
            "indexed successfully",

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
                    ""
                ).upper(),

            "size":
                len(content),

            "status":
                "Indexed",

            "progress":
                100,

            "chunks":
                total_chunks
        }
    }