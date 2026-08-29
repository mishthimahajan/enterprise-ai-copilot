from datetime import datetime, timezone
import time
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from pydantic import BaseModel

from database.mongodb import (
    agents_collection,
    repositories_collection,
)

from utils.auth import (
    decode_access_token,
)

from services.github_service import (
    clone_repository,
)

from services.chunker import (
    chunk_text,
)

from services.qdrant_service import (
    create_collection,
    store_chunks_batch,
    delete_repository_chunks,
)

# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/github",
    tags=["GitHub"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class GitHubRepositoryRequest(BaseModel):
    agent_id: str
    repo_url: str
    branch: str = "main"
    github_token: str | None = None


# =========================================================
# AUTHENTICATION
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
            detail="Invalid authentication token",
        )

    return user_id


# =========================================================
# VERIFY SHARED AGENT
# =========================================================

def verify_shared_agent(
    agent_id: str,
):

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
# MONGODB INSERT WITH RETRY
# =========================================================

def insert_repository_with_retry(
    repository: dict,
    max_retries: int = 4,
):

    for attempt in range(
        1,
        max_retries + 1,
    ):

        try:

            return (
                repositories_collection.insert_one(
                    repository
                )
            )

        except Exception as error:

            print(
                (
                    "REPOSITORY DATABASE INSERT ERROR "
                    f"(attempt "
                    f"{attempt}/"
                    f"{max_retries}):"
                ),
                repr(error),
                flush=True,
            )

            if (
                attempt
                == max_retries
            ):

                raise

            wait_seconds = (
                attempt * 3
            )

            print(
                (
                    "Retrying MongoDB insert in "
                    f"{wait_seconds} seconds..."
                ),
                flush=True,
            )

            time.sleep(
                wait_seconds
            )


# =========================================================
# MONGODB UPDATE WITH RETRY
# =========================================================

def update_repository_with_retry(
    repository_id: str,
    values: dict,
    max_retries: int = 4,
):

    for attempt in range(
        1,
        max_retries + 1,
    ):

        try:

            return (
                repositories_collection.update_one(
                    {
                        "repository_id":
                            repository_id
                    },
                    {
                        "$set":
                            values
                    },
                )
            )

        except Exception as error:

            print(
                (
                    "REPOSITORY DATABASE UPDATE ERROR "
                    f"(attempt "
                    f"{attempt}/"
                    f"{max_retries}):"
                ),
                repr(error),
                flush=True,
            )

            if (
                attempt
                == max_retries
            ):

                raise

            wait_seconds = (
                attempt * 3
            )

            print(
                (
                    "Retrying MongoDB update in "
                    f"{wait_seconds} seconds..."
                ),
                flush=True,
            )

            time.sleep(
                wait_seconds
            )


# =========================================================
# CONNECT + INDEX GITHUB REPOSITORY
# =========================================================

@router.post("/connect")
def connect_repository(
    request: GitHubRepositoryRequest,

    token: dict = Depends(
        decode_access_token
    ),
):

    # =====================================================
    # AUTHENTICATION
    # =====================================================

    user_id = (
        get_authenticated_user_id(
            token
        )
    )


    # =====================================================
    # VERIFY AGENT
    # =====================================================

    verify_shared_agent(
        request.agent_id
    )


    # =====================================================
    # NORMALIZE INPUT
    # =====================================================

    repo_url = (
        request.repo_url
        .strip()
    )

    branch = (
        request.branch
        .strip()
    )


    if not repo_url:

        raise HTTPException(
            status_code=400,
            detail=(
                "Repository URL is required"
            ),
        )


    if not branch:

        raise HTTPException(
            status_code=400,
            detail=(
                "Branch name is required"
            ),
        )


    # =====================================================
    # CHECK WHETHER REPOSITORY ALREADY EXISTS
    # =====================================================

    try:

        existing_repository = (
            repositories_collection.find_one(
                {
                    "agent_id":
                        request.agent_id,

                    "repo_url":
                        repo_url,

                    "branch":
                        branch,
                }
            )
        )

    except Exception as error:

        print(
            "REPOSITORY LOOKUP ERROR:",
            repr(error),
            flush=True,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to check existing repository"
            ),
        )


    # =====================================================
    # EXISTING REPOSITORY
    # =====================================================

    if existing_repository:

        repository_id = (
            existing_repository.get(
                "repository_id"
            )
        )


        if not repository_id:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Existing repository has invalid repository_id"
                ),
            )


        print(
            "EXISTING REPOSITORY FOUND:",
            repository_id,
            flush=True,
        )


        # -------------------------------------------------
        # Mark as processing again
        # -------------------------------------------------

        update_repository_with_retry(
            repository_id,
            {
                "status":
                    "Processing",

                "error":
                    None,

                "connected_by":
                    user_id,

                "updated_at":
                    datetime.now(
                        timezone.utc
                    ),
            },
        )


        # -------------------------------------------------
        # Remove old vectors before re-indexing
        # -------------------------------------------------

        try:

            delete_repository_chunks(
                agent_id=
                    request.agent_id,

                repository_id=
                    repository_id,
            )


            print(
                (
                    "OLD REPOSITORY VECTORS "
                    "REMOVED SUCCESSFULLY"
                ),
                flush=True,
            )


        except Exception as error:

            # We allow indexing to continue.
            # Deterministic point IDs also reduce
            # duplicate-vector problems.
            print(
                (
                    "OLD REPOSITORY CHUNK "
                    "CLEANUP WARNING:"
                ),
                repr(error),
                flush=True,
            )


    # =====================================================
    # NEW REPOSITORY
    # =====================================================

    else:

        repository_id = str(
            uuid.uuid4()
        )


        now = datetime.now(
            timezone.utc
        )


        repository = {

            "repository_id":
                repository_id,

            "agent_id":
                request.agent_id,

            "repo_url":
                repo_url,

            "branch":
                branch,

            "connected_by":
                user_id,

            "status":
                "Processing",

            "files_indexed":
                0,

            "chunks":
                0,

            "created_at":
                now,

            "updated_at":
                now,

            "error":
                None,
        }


        try:

            insert_repository_with_retry(
                repository
            )


            print(
                "NEW REPOSITORY RECORD CREATED:",
                repository_id,
                flush=True,
            )


        except Exception as error:

            print(
                "REPOSITORY DATABASE ERROR:",
                repr(error),
                flush=True,
            )


            raise HTTPException(
                status_code=500,
                detail=(
                    "Failed to create repository record"
                ),
            )


    # =====================================================
    # CLONE + PROCESS REPOSITORY
    # =====================================================

    try:

        print(
            "================================",
            flush=True,
        )

        print(
            "GITHUB INDEXING START",
            flush=True,
        )

        print(
            "Repository:",
            repo_url,
            flush=True,
        )

        print(
            "Branch:",
            branch,
            flush=True,
        )

        print(
            "Repository ID:",
            repository_id,
            flush=True,
        )


        # =================================================
        # CLONE REPOSITORY
        # =================================================

        repo_data = (
            clone_repository(
                repo_url=
                    repo_url,

                branch=
                    branch,

                github_token=
                    request.github_token,
            )
        )


        files = repo_data.get(
            "files",
            [],
        )


        print(
            "GITHUB FILE COUNT:",
            len(files),
            flush=True,
        )


        if not files:

            raise Exception(
                "No supported source files found"
            )


        # =================================================
        # ENSURE QDRANT COLLECTION
        # =================================================

        create_collection()


        # =================================================
        # CREATE CODE CHUNKS
        # =================================================

        all_chunks = []


        for file_data in files:

            file_path = (
                file_data.get(
                    "file_path",
                    "",
                )
            )


            language = (
                file_data.get(
                    "language",
                    "text",
                )
            )


            content = (
                file_data.get(
                    "content",
                    "",
                )
            )


            if (
                not content
                or
                not content.strip()
            ):

                continue


            print(
                "PROCESSING FILE:",
                file_path,
                flush=True,
            )


            chunks = chunk_text(
                content
            )


            if not chunks:

                print(
                    "NO CHUNKS CREATED FOR:",
                    file_path,
                    flush=True,
                )

                continue


            for index, chunk in enumerate(
                chunks
            ):

                if isinstance(
                    chunk,
                    str,
                ):

                    clean_chunk = (
                        chunk.strip()
                    )

                else:

                    clean_chunk = (
                        str(
                            chunk
                        ).strip()
                    )


                if not clean_chunk:

                    continue


                all_chunks.append(
                    {

                        "text":
                            clean_chunk,

                        "agent_id":
                            request.agent_id,

                        # Kept for compatibility
                        # with existing Qdrant design.
                        "document_id":
                            repository_id,

                        "repository_id":
                            repository_id,

                        "filename":
                            file_path,

                        "file_path":
                            file_path,

                        "chunk_index":
                            index,

                        "language":
                            language,

                        "source_type":
                            "github",
                    }
                )


        # =================================================
        # VALIDATE CHUNKS
        # =================================================

        total_chunks = len(
            all_chunks
        )


        print(
            "TOTAL GITHUB CHUNKS:",
            total_chunks,
            flush=True,
        )


        if (
            total_chunks
            == 0
        ):

            raise Exception(
                "Repository produced no chunks"
            )


        # =================================================
        # STORE IN QDRANT
        # =================================================

        print(
            "STARTING QDRANT BATCH STORE...",
            flush=True,
        )


        stored_count = (
            store_chunks_batch(
                all_chunks,
                batch_size=5,
            )
        )


        print(
            "QDRANT STORED:",
            stored_count,
            "/",
            total_chunks,
            flush=True,
        )


        if (
            stored_count
            != total_chunks
        ):

            raise Exception(
                (
                    "Not all repository chunks "
                    "were stored in Qdrant"
                )
            )


        # =================================================
        # MARK AS INDEXED
        # =================================================

        update_repository_with_retry(
            repository_id,
            {

                "status":
                    "Indexed",

                "files_indexed":
                    len(files),

                "chunks":
                    total_chunks,

                "error":
                    None,

                "updated_at":
                    datetime.now(
                        timezone.utc
                    ),
            },
        )


        print(
            "GITHUB REPOSITORY INDEXED SUCCESSFULLY",
            flush=True,
        )

        print(
            "Repository ID:",
            repository_id,
            flush=True,
        )

        print(
            "Files:",
            len(files),
            flush=True,
        )

        print(
            "Chunks:",
            total_chunks,
            flush=True,
        )

        print(
            "================================",
            flush=True,
        )


        return {

            "message":
                (
                    "Repository connected "
                    "and indexed successfully"
                ),

            "repository": {

                "repository_id":
                    repository_id,

                "agent_id":
                    request.agent_id,

                "repo_url":
                    repo_url,

                "branch":
                    branch,

                "status":
                    "Indexed",

                "files_indexed":
                    len(files),

                "chunks":
                    total_chunks,
            },
        }


    # =====================================================
    # FAILURE HANDLING
    # =====================================================

    except Exception as error:

        try:

            update_repository_with_retry(
                repository_id,
                {

                    "status":
                        "Failed",

                    "updated_at":
                        datetime.now(
                            timezone.utc
                        ),

                    "error":
                        str(error),
                },
            )

        except Exception as database_error:

            print(
                (
                    "FAILED TO SAVE REPOSITORY "
                    "ERROR STATUS:"
                ),
                repr(
                    database_error
                ),
                flush=True,
            )


        print(
            "GITHUB INDEXING ERROR:",
            repr(error),
            flush=True,
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Repository connection or indexing failed"
            ),
        )


# =========================================================
# GET REPOSITORIES FOR SELECTED AGENT
# =========================================================

@router.get("/repositories")
def get_repositories(
    agent_id: str = Query(...),

    token: dict = Depends(
        decode_access_token
    ),
):

    # =====================================================
    # AUTH
    # =====================================================

    get_authenticated_user_id(
        token
    )


    # =====================================================
    # VERIFY AGENT
    # =====================================================

    verify_shared_agent(
        agent_id
    )


    # =====================================================
    # GET REPOSITORIES
    # =====================================================

    try:

        repositories = list(
            repositories_collection.find(
                {
                    "agent_id":
                        agent_id
                }
            ).sort(
                "created_at",
                -1,
            )
        )

    except Exception as error:

        print(
            "GET REPOSITORIES DATABASE ERROR:",
            repr(error),
            flush=True,
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to load repositories"
            ),
        )


    result = []


    for repo in repositories:

        result.append(
            {

                "repository_id":
                    repo.get(
                        "repository_id"
                    ),

                "agent_id":
                    repo.get(
                        "agent_id"
                    ),

                "repo_url":
                    repo.get(
                        "repo_url"
                    ),

                "branch":
                    repo.get(
                        "branch",
                        "main",
                    ),

                "status":
                    repo.get(
                        "status",
                        "Processing",
                    ),

                "files_indexed":
                    repo.get(
                        "files_indexed",
                        0,
                    ),

                "chunks":
                    repo.get(
                        "chunks",
                        0,
                    ),

                "connected_by":
                    repo.get(
                        "connected_by"
                    ),

                "created_at":
                    repo.get(
                        "created_at"
                    ),

                "updated_at":
                    repo.get(
                        "updated_at"
                    ),

                "error":
                    repo.get(
                        "error"
                    ),
            }
        )


    return {

        "repositories":
            result,

        "total":
            len(result),

        "indexed":
            sum(
                1
                for repo
                in result
                if (
                    repo["status"]
                    == "Indexed"
                )
            ),

        "total_files":
            sum(
                repo[
                    "files_indexed"
                ] or 0
                for repo
                in result
            ),

        "total_chunks":
            sum(
                repo[
                    "chunks"
                ] or 0
                for repo
                in result
            ),
    }

# =========================================================
# RE-INDEX EXISTING GITHUB REPOSITORY
# =========================================================

@router.post("/repositories/{repository_id}/reindex")
def reindex_repository(
    repository_id: str,

    token: dict = Depends(
        decode_access_token
    ),
):
    # Authenticate the current user.
    get_authenticated_user_id(
        token
    )

    try:
        repository = (
            repositories_collection.find_one(
                {
                    "repository_id":
                        repository_id
                }
            )
        )

    except Exception as error:
        print(
            "REINDEX REPOSITORY LOOKUP ERROR:",
            repr(error),
            flush=True,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to load repository",
        )

    if not repository:
        raise HTTPException(
            status_code=404,
            detail="Repository not found",
        )

    agent_id = repository.get(
        "agent_id"
    )

    repo_url = repository.get(
        "repo_url"
    )

    branch = (
        repository.get(
            "branch"
        )
        or "main"
    )

    if not agent_id:
        raise HTTPException(
            status_code=500,
            detail="Repository has no agent_id",
        )

    if not repo_url:
        raise HTTPException(
            status_code=500,
            detail="Repository has no repo_url",
        )

    verify_shared_agent(
        agent_id
    )

    # Reuse the already-working connect/index flow.
    # That flow detects the existing repository,
    # deletes its old Qdrant chunks, clones fresh code,
    # stores new chunks, and updates MongoDB stats.
    request = GitHubRepositoryRequest(
        agent_id=agent_id,
        repo_url=repo_url,
        branch=branch,
        github_token=None,
    )

    try:
        result = connect_repository(
            request=request,
            token=token,
        )

    except HTTPException:
        raise

    except Exception as error:
        print(
            "REINDEX ERROR:",
            repr(error),
            flush=True,
        )

        raise HTTPException(
            status_code=500,
            detail="Repository re-indexing failed",
        )

    if isinstance(result, dict):
        result["message"] = (
            "Repository re-indexed successfully"
        )

    return result
