from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Dict

from git import Repo




SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".cpp",
    ".cc",
    ".cxx",
    ".c",
    ".h",
    ".hpp",
    ".go",
    ".rs",
    ".html",
    ".css",
    ".scss",
    ".md",
    ".json",
    ".yml",
    ".yaml",
    ".sql",
    ".sh",
}




IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    ".idea",
    ".vscode",
}




IGNORED_FILENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".env.test",
}




def should_index_file(
    relative_path: Path,
) -> bool:

    

    for part in relative_path.parts:

        if part in IGNORED_DIRECTORIES:
            return False


    

    if (
        relative_path.name
        in IGNORED_FILENAMES
    ):
        return False


    

    lower_name = (
        relative_path.name.lower()
    )


    if (
        lower_name.endswith(".pem")
        or lower_name.endswith(".key")
        or "credentials" in lower_name
        or "secret" in lower_name
    ):
        return False


    

    extension = (
        relative_path.suffix.lower()
    )


    if (
        extension
        not in SUPPORTED_EXTENSIONS
    ):
        return False


    return True




def detect_language(
    path: Path,
) -> str:

    extension_map = {

        ".py":
            "python",

        ".js":
            "javascript",

        ".jsx":
            "javascript",

        ".ts":
            "typescript",

        ".tsx":
            "typescript",

        ".java":
            "java",

        ".cpp":
            "cpp",

        ".cc":
            "cpp",

        ".cxx":
            "cpp",

        ".c":
            "c",

        ".h":
            "c",

        ".hpp":
            "cpp",

        ".go":
            "go",

        ".rs":
            "rust",

        ".html":
            "html",

        ".css":
            "css",

        ".scss":
            "scss",

        ".md":
            "markdown",

        ".json":
            "json",

        ".yml":
            "yaml",

        ".yaml":
            "yaml",

        ".sql":
            "sql",

        ".sh":
            "shell",
    }


    return extension_map.get(
        path.suffix.lower(),
        "text",
    )




def clone_repository(
    repo_url: str,
    branch: str = "main",
    github_token: str | None = None,
) -> Dict:

    print(
        "================================",
        flush=True,
    )

    print(
        "GITHUB CLONE START",
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


   

    with TemporaryDirectory() as temp_dir:

        clone_root = (
            Path(temp_dir)
            / "repository"
        )


        clean_repo_url = (
            repo_url.strip()
        )


        

        clone_url = (
            clean_repo_url
        )


        if github_token:

            if (
                clone_url.startswith(
                    "https://"
                )
            ):

                clone_url = (
                    clone_url.replace(
                        "https://",
                        (
                            "https://"
                            f"{github_token}@"
                        ),
                        1,
                    )
                )


       

        try:

            Repo.clone_from(
                clone_url,
                str(clone_root),

                branch=
                    branch,

                single_branch=
                    True,

                depth=
                    1,
            )


        except Exception as error:

            print(
                "GITHUB CLONE ERROR:",
                repr(error),
                flush=True,
            )


            raise Exception(
                (
                    "Failed to clone repository: "
                    f"{error}"
                )
            )


        print(
            "GITHUB CLONE SUCCESSFUL",
            flush=True,
        )


        
        all_files = [
            path
            for path
            in clone_root.rglob("*")
            if path.is_file()
        ]


        print(
            "TOTAL FILES IN REPOSITORY:",
            len(all_files),
            flush=True,
        )


       

        for path in all_files[:20]:

            try:

                relative_path = (
                    path.relative_to(
                        clone_root
                    )
                )


                print(
                    "RAW REPO FILE:",
                    str(
                        relative_path
                    ).replace(
                        "\\",
                        "/",
                    ),
                    flush=True,
                )


            except Exception:
                pass


        

        files = []


        for path in all_files:

            

            try:

                relative_path = (
                    path.relative_to(
                        clone_root
                    )
                )


            except Exception:

                continue


            

            if not should_index_file(
                relative_path
            ):

                continue


           

            try:

                file_size = (
                    path.stat().st_size
                )


                if (
                    file_size
                    > 1_000_000
                ):

                    print(
                        "SKIPPING LARGE FILE:",
                        str(
                            relative_path
                        ),
                        flush=True,
                    )

                    continue


            except Exception:

                continue


           

            try:

                content = (
                    path.read_text(
                        encoding="utf-8",
                        errors="ignore",
                    )
                )


            except Exception as error:

                print(
                    "FAILED TO READ FILE:",
                    str(
                        relative_path
                    ),
                    repr(error),
                    flush=True,
                )

                continue


            
            if not content.strip():

                continue


          
            clean_path = (
                str(
                    relative_path
                )
                .replace(
                    "\\",
                    "/",
                )
            )


           

            files.append(
                {

                    "file_path":
                        clean_path,

                    "language":
                        detect_language(
                            relative_path
                        ),

                    "content":
                        content,

                    "size":
                        file_size,
                }
            )


        

        print(
            "GITHUB FILES FOUND:",
            len(files),
            flush=True,
        )


        for file in files[:30]:

            print(
                "INDEXABLE FILE:",
                file[
                    "file_path"
                ],
                flush=True,
            )


        print(
            "GITHUB CLONE PROCESS COMPLETE",
            flush=True,
        )

        print(
            "================================",
            flush=True,
        )


        return {

            "files":
                files,

            "file_count":
                len(files),
        }



