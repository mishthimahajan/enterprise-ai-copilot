from pathlib import Path
from pypdf import PdfReader

from docx import Document

def parse_document(file_path:str) -> str:

    path = Path(file_path)
    extension = path.suffix.lower()

    if extension == ".pdf":
        reader = PdfReader(file_path)

        pages = []

        for page in reader.pages:

            text = page.extract_text()

            if text:

                pages.append(text)

        return "\n".join(pages)

    elif extension == ".docx":
        document = Document(file_path)

        paragraphs = []

        for paragraph in document.paragraphs:

            if paragraph.text.strip():

                paragraphs.append(
                    paragraph.text
                )
        return "\n".join(paragraphs)


    elif extension in [".txt", ".md"]:

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            return file.read()

    else:

        raise ValueError(
            f"Unsupported file type: {extension}"
        )