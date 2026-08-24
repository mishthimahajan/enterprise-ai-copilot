import API from "./api";

export interface DocumentItem {
  id: string;
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


export const getDocuments =
  async (): Promise<DocumentsResponse> => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Authentication token not found"
      );
    }

    const response =
      await API.get("/documents", {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });

    return response.data;
  };


export const uploadDocument =
  async (file: File) => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Authentication token not found"
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await API.post(
        "/documents/upload",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };