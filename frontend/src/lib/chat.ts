import api from "./axios";


// =====================================================
// TYPES
// =====================================================

export interface ChatSource {
  filename?: string;
  file_path?: string;

  document_id?: string;
  repository_id?: string;

  language?: string;
  source_type?: string;

  chunk_index?: number;
  score?: number;
  source_url?: string;
}


export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}


export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}


export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
}


// =====================================================
// SEND CHAT MESSAGE
// =====================================================

export async function sendChatMessage(
  question: string,
  agentId: string,
  documentId: string | null = null,
  repositoryId: string | null = null
): Promise<ChatResponse> {

  if (!question.trim()) {
    throw new Error(
      "Question cannot be empty."
    );
  }

  if (!agentId) {
    throw new Error(
      "Please select an agent first."
    );
  }

  if (
    !documentId &&
    !repositoryId
  ) {
    throw new Error(
      "Please select a document or repository first."
    );
  }

  if (
    documentId &&
    repositoryId
  ) {
    throw new Error(
      "Select either a document or repository, not both."
    );
  }

  try {

    const response =
      await api.post<ChatResponse>(
        "/chat",
        {
          question:
            question.trim(),

          agent_id:
            agentId,

          document_id:
            documentId,

          repository_id:
            repositoryId,
        }
      );

    return response.data;

  } catch (error: any) {

    console.error(
      "CHAT API ERROR:",
      error.response?.data ||
        error
    );

    const detail =
      error.response?.data?.detail;

    if (
      typeof detail === "string"
    ) {
      throw new Error(
        detail
      );
    }

    if (
      Array.isArray(detail)
    ) {
      throw new Error(
        detail
          .map(
            (item: any) =>
              item?.msg ||
              "Invalid request"
          )
          .join(", ")
      );
    }

    if (!error.response) {
      throw new Error(
        "Unable to connect to backend API."
      );
    }

    throw new Error(
      "Failed to get AI response."
    );
  }
}


// =====================================================
// GET CHAT HISTORY
// =====================================================

export async function getChatHistory(
  agentId: string,
  documentId: string | null = null,
  repositoryId: string | null = null
): Promise<ChatHistoryResponse> {

  if (!agentId) {
    throw new Error(
      "Agent ID is required."
    );
  }

  if (
    documentId &&
    repositoryId
  ) {
    throw new Error(
      "Select either a document or repository, not both."
    );
  }

  if (
    !documentId &&
    !repositoryId
  ) {
    return {
      messages: [],
    };
  }

  try {

    // -------------------------------------------------
    // BUILD QUERY PARAMETERS
    // -------------------------------------------------

    const params: {
      document_id?: string;
      repository_id?: string;
    } = {};


    if (documentId) {
      params.document_id =
        documentId;
    }


    if (repositoryId) {
      params.repository_id =
        repositoryId;
    }


    // -------------------------------------------------
    // REQUEST
    // -------------------------------------------------

    const response =
      await api.get<ChatHistoryResponse>(
        `/chat/history/${encodeURIComponent(
          agentId
        )}`,
        {
          params,
        }
      );


    return response.data;


  } catch (error: any) {

    console.error(
      "CHAT HISTORY ERROR:",
      error.response?.data ||
        error
    );


    const detail =
      error.response?.data?.detail;


    if (
      typeof detail ===
      "string"
    ) {
      throw new Error(
        detail
      );
    }


    if (!error.response) {
      throw new Error(
        "Unable to connect to backend API."
      );
    }


    throw new Error(
      "Failed to load chat history."
    );
  }
}


// =====================================================
// CLEAR CHAT HISTORY
// =====================================================

export async function clearChatHistory(
  agentId: string,
  documentId: string | null = null,
  repositoryId: string | null = null
): Promise<void> {

  if (!agentId) {
    throw new Error(
      "Agent ID is required."
    );
  }


  if (
    !documentId &&
    !repositoryId
  ) {
    throw new Error(
      "Please select a document or repository first."
    );
  }


  if (
    documentId &&
    repositoryId
  ) {
    throw new Error(
      "Select either a document or repository, not both."
    );
  }


  try {

    // -------------------------------------------------
    // BUILD QUERY PARAMETERS
    // -------------------------------------------------

    const params: {
      document_id?: string;
      repository_id?: string;
    } = {};


    if (documentId) {
      params.document_id =
        documentId;
    }


    if (repositoryId) {
      params.repository_id =
        repositoryId;
    }


    // -------------------------------------------------
    // DELETE REQUEST
    // -------------------------------------------------

    await api.delete(
      `/chat/history/${encodeURIComponent(
        agentId
      )}`,
      {
        params,
      }
    );


  } catch (error: any) {

    console.error(
      "CLEAR CHAT ERROR:",
      error.response?.data ||
        error
    );


    const detail =
      error.response?.data?.detail;


    if (
      typeof detail ===
      "string"
    ) {
      throw new Error(
        detail
      );
    }


    if (!error.response) {
      throw new Error(
        "Unable to connect to backend API."
      );
    }


    throw new Error(
      "Failed to clear chat history."
    );
  }
}