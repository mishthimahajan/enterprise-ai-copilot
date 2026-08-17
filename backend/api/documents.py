from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from datetime import datetime, timezone
from pathlib import Path
import uuid

from database.mongodb import documents_collection

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




@router.get("")
def get_documents(
    token: dict = Depends(decode_access_token)
):

    user_id = token.get("user_id")
    agent_id = token.get("agent_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    if not agent_id:
        raise HTTPException(
            status_code=400,
            detail="No agent assigned to this user"
        )

    print("======================================")
    print("GET DOCUMENTS")
    print("User ID:", user_id)
    print("Agent ID:", agent_id)
    print("======================================")




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

            "agent_id": document.get(
                "agent_id"
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
            )
        })


    return {

        "agent_id": agent_id,

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

    file: UploadFile = File(...),

    token: dict = Depends(
        decode_access_token
    )
):

    user_id = token.get("user_id")
    agent_id = token.get("agent_id")


    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


    if not agent_id:

        raise HTTPException(
            status_code=400,
            detail="No agent assigned to this user"
        )


    print("======================================")
    print("DOCUMENT UPLOAD")
    print("User ID:", user_id)
    print("Agent ID:", agent_id)
    print("Filename:", file.filename)
    print("======================================")



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




    document_id = str(
        uuid.uuid4()
    )


    now = datetime.now(
        timezone.utc
    )




    document = {

        "document_id": document_id,

        # IMPORTANT
        # Agent owns the knowledge/document.
        "agent_id": agent_id,

        # User who uploaded it.
        "uploaded_by": user_id,

        "name": file.filename,

        "stored_name": unique_name,

        "type": extension.replace(
            ".",
            ""
        ).upper(),

        "size": len(content),

        "status": "Processing",

        "progress": 0,

        "chunks": 0,

        "uploaded_at": now,

        "file_path": str(
            file_path
        )
    }


    result = documents_collection.insert_one(
        document
    )


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
                    "_id": result.inserted_id
                },

                {
                    "$set": {

                        "status": "Failed",

                        "progress": 0
                    }
                }
            )

            raise HTTPException(
                status_code=400,
                detail="Could not extract text from document"
            )



        print(
            "Creating text chunks..."
        )


        chunks = chunk_text(
            text
        )


        if not chunks:

            documents_collection.update_one(

                {
                    "_id": result.inserted_id
                },

                {
                    "$set": {

                        "status": "Failed",

                        "progress": 0
                    }
                }
            )

            raise HTTPException(
                status_code=400,
                detail="No text chunks were created"
            )


        total_chunks = len(
            chunks
        )


        print(
            f"Created {total_chunks} chunks"
        )



        create_collection()




        for index, chunk in enumerate(chunks):


            store_chunk(

                text=chunk,

                # VERY IMPORTANT
                # Every vector gets the agent ID.
                agent_id=agent_id,

                document_id=document_id,

                filename=file.filename,

                chunk_index=index
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
                    "_id": result.inserted_id
                },

                {
                    "$set": {

                        "progress": progress
                    }
                }
            )


            print(
                f"Indexed chunk "
                f"{index + 1}/{total_chunks}"
            )




        documents_collection.update_one(

            {
                "_id": result.inserted_id
            },

            {
                "$set": {

                    "status": "Indexed",

                    "progress": 100,

                    "chunks": total_chunks
                }
            }
        )


        print(
            "======================================"
        )

        print(
            "Document indexed successfully"
        )

        print(
            "Agent ID:",
            agent_id
        )

        print(
            "Document ID:",
            document_id
        )

        print(
            "Chunks:",
            total_chunks
        )

        print(
            "======================================"
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
                "_id": result.inserted_id
            },

            {
                "$set": {

                    "status": "Failed",

                    "progress": 0
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



    return {

        "message":
            "Document uploaded and indexed successfully",

        "agent_id":
            agent_id,

        "uploaded_by":
            user_id,

        "document": {

            "id":
                str(result.inserted_id),

            "document_id":
                document_id,

            "agent_id":
                agent_id,

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