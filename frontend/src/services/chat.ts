

import API from "./api";


export interface ChatSource {
  filename?: string;
  document_id?: string;
  chunk_index?: number;
  score?: number;
}


export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
}


export interface ChatHistoryMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  created_at?: string;
}


export async function sendChatMessage(
  question: string,
  agentId: string,
  documentId?: string,
  repositoryId?: string
): Promise<ChatResponse> {

  if (!question.trim()) {
    throw new Error(
      "Question cannot be empty."
    );
  }

  if (!agentId) {
    throw new Error(
      "Agent is required."
    );
  }

  try {
    const response =
      await API.post<ChatResponse>(
        "/chat",
        {
          question:
            question.trim(),

          agent_id:
            agentId,

          document_id:
            documentId || null,

          repository_id :
            repositoryId || null
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
      typeof detail === "string"
    ) {
      throw new Error(
        detail
      );
    }

    throw new Error(
      "Failed to get chat response."
    );
  }
}


export async function getChatHistory(
  agentId: string,
  documentId?: string
): Promise<ChatHistoryMessage[]> {

  if (!agentId) {
    return [];
  }

  try {
    const response =
      await API.get(
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


    const data =
      response.data;


    if (
      Array.isArray(data)
    ) {
      return data;
    }


    if (
      Array.isArray(
        data.messages
      )
    ) {
      return data.messages;
    }


    return [];

  } catch (error: any) {

    console.error(
      "CHAT HISTORY ERROR:",
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

    throw new Error(
      "Failed to load chat history."
    );
  }
}


export async function clearChatHistory(
  agentId: string,
  documentId?: string
): Promise<void> {

  try {
    await API.delete(
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

  } catch (error: any) {

    console.error(
      "CLEAR CHAT ERROR:",
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

    throw new Error(
      "Failed to clear chat history."
    );
  }
}
