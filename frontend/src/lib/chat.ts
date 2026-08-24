import api from "./axios";


// =====================================================
// TYPES
// =====================================================

export interface ChatSource {
  filename?: string;
  document_id?: string;
  chunk_index?: number;
  score?: number;
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
  documentId?: string
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


  if (!documentId) {
    throw new Error(
      "Please select a document first."
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
        }
      );


    return response.data;


  } catch (error: any) {

    console.error(
      "CHAT REQUEST ERROR:",
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


    throw new Error(
      "Failed to get an AI response."
    );
  }
}


// =====================================================
// GET CHAT HISTORY
// =====================================================

export async function getChatHistory(
  agentId: string,
  documentId?: string
): Promise<ChatHistoryResponse> {

  if (!agentId) {
    throw new Error(
      "Agent ID is required."
    );
  }


  try {

    const response =
      await api.get<ChatHistoryResponse>(
        `/chat/history/${encodeURIComponent(
          agentId
        )}`,
        {
          params:
            documentId
              ? {
                  document_id:
                    documentId,
                }
              : {},
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
  documentId?: string
): Promise<void> {

  if (!agentId) {
    throw new Error(
      "Agent ID is required."
    );
  }


  if (!documentId) {
    throw new Error(
      "Document ID is required."
    );
  }


  try {

    await api.delete(
      `/chat/history/${encodeURIComponent(
        agentId
      )}`,
      {
        params: {
          document_id:
            documentId,
        },
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


    throw new Error(
      "Failed to clear chat history."
    );
  }
}