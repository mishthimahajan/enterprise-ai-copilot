import api from "./axios";

export interface DocumentItem {
  id: string;
  document_id: string;
  agent_id?: string;
  name: string;
  type: string;
  size: number;
  status: string;
  progress: number;
  uploaded_at: string;
  chunks: number;
}

export interface DocumentsResponse {
  documents: DocumentItem[];
  total: number;
  indexed: number;
  chunks: number;
}

export interface UploadDocumentResponse {
  message: string;

  document: {
    id: string;
    document_id: string;
    agent_id?: string;
    uploaded_by?: string;
    name: string;
    type: string;
    size: number;
    status: string;
    progress: number;
    chunks: number;
  };
}

export async function getDocuments(
  agentId: string
): Promise<DocumentsResponse> {
  try {
    const response =
      await api.get<DocumentsResponse>(
        "/documents",
        {
          params: {
            agent_id: agentId,
          },
        }
      );

    return response.data;

  } catch (error: any) {
    console.error(
      "GET DOCUMENTS ERROR:",
      error.response?.data ||
        error
    );

    const detail =
      error.response?.data?.detail;

    let message =
      "Failed to load documents.";

    if (
      typeof detail ===
      "string"
    ) {
      message = detail;
    }

    else if (
      Array.isArray(detail)
    ) {
      message =
        detail
          .map(
            (item: any) =>
              item.msg
          )
          .join(", ");
    }

    throw new Error(message);
  }
}

export async function uploadDocument(
  agentId: string,
  file: File
): Promise<UploadDocumentResponse> {
  try {
    if (!agentId) {
      throw new Error(
        "Agent ID is required."
      );
    }

    if (!file) {
      throw new Error(
        "File is required."
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file,
      file.name
    );

    const response =
      await api.post<UploadDocumentResponse>(
        "/documents/upload",
        formData,
        {
          params: {
            agent_id: agentId,
          },
        }
      );

    return response.data;

  } catch (error: any) {
    console.error(
      "UPLOAD DOCUMENT ERROR:",
      error.response?.data ||
        error
    );

    const detail =
      error.response?.data?.detail;

    let message =
      "Document upload failed.";

    if (
      typeof detail ===
      "string"
    ) {
      message = detail;
    }

    else if (
      Array.isArray(detail)
    ) {
      message =
        detail
          .map((item: any) => {
            const location =
              item.loc?.join(" → ");

            return location
              ? `${location}: ${item.msg}`
              : item.msg;
          })
          .join(", ");
    }

    else if (
      error instanceof Error
    ) {
      message =
        error.message;
    }

    throw new Error(message);
  }
}