import API from "./api";
import api from "@/lib/axios";

export interface GitHubRepository {
  repository_id: string;
  agent_id: string;
  repo_url: string;
  branch: string;
  status: string;
  files_indexed: number;
  chunks: number;
  connected_by?: string;
  created_at?: string;
  updated_at?: string;
  error?: string | null;
}

export interface GitHubRepositoriesResponse {
  repositories: GitHubRepository[];
  total: number;
  indexed: number;
  total_files: number;
  total_chunks: number;
}

export interface ConnectRepositoryData {
  agent_id: string;
  repo_url: string;
  branch: string;
  github_token?: string | null;
}

export interface ConnectRepositoryResponse {
  message: string;

  repository: {
    repository_id: string;
    agent_id: string;
    repo_url: string;
    branch: string;
    status: string;
    files_indexed: number;
    chunks: number;
  };
}

export async function connectRepository(
  data: ConnectRepositoryData
): Promise<ConnectRepositoryResponse> {
  try {
    const response =
      await API.post<ConnectRepositoryResponse>(
        "/github/connect",
        data
      );

    return response.data;

  } catch (error: any) {
    console.error(
      "GITHUB CONNECT ERROR:",
      error.response?.data || error
    );

    const detail =
      error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    if (!error.response) {
      throw new Error(
        "Unable to connect to the backend API."
      );
    }

    throw new Error(
      "Failed to connect GitHub repository."
    );
  }
}

export async function getRepositories(
  agentId: string
): Promise<GitHubRepositoriesResponse> {
  try {
    const response =
      await API.get<GitHubRepositoriesResponse>(
        "/github/repositories",
        {
          params: {
            agent_id: agentId,
          },
        }
      );

    return response.data;

  } catch (error: any) {
    console.error(
      "GET REPOSITORIES ERROR:",
      error.response?.data || error
    );

    const detail =
      error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    throw new Error(
      "Failed to load repositories."
    );
  }
}

export function setSelectedRepository(
  repositoryId: string
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "selected_repository_id",
    repositoryId
  );
}

export function getSelectedRepository():
  string | null {

  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "selected_repository_id"
  );
}

export function clearSelectedRepository() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    "selected_repository_id"
  );
}

export async function reindexRepository(
  repositoryId: string
) {
  try {
    const response = await api.post(
      `/github/repositories/${repositoryId}/reindex`
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "REINDEX REPOSITORY ERROR:",
      error.response?.data || error
    );

    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    throw new Error(
      "Failed to re-index repository."
    );
  }
}

export async function deleteRepository(
  repositoryId: string
) {
  try {
    const response = await api.delete(
      `/github/repositories/${repositoryId}`
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "DELETE REPOSITORY ERROR:",
      error.response?.data || error
    );

    const detail =
      error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    throw new Error(
      "Failed to delete repository."
    );
  }
}