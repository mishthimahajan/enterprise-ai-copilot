import API from "./api";


// =========================================================
// TYPES
// =========================================================

export interface RegisterData {
  name: string;
  email: string;
  agent_id: string;
  password: string;
  role: string;
}


export interface LoginData {
  email: string;
  password: string;
}


export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;

  user?: {
    user_id?: string;
    name?: string;
    email?: string;
    agent_id?: string;
    role?: string;
  };

  message?: string;
}


// =========================================================
// REGISTER
// =========================================================

export async function registerUser(
  data: RegisterData
): Promise<AuthResponse> {

  try {

    const response =
      await API.post<AuthResponse>(
        "/register",
        data
      );

    return response.data;

  } catch (error: any) {

    console.error(
      "REGISTER API ERROR:",
      {
        status:
          error.response?.status,

        data:
          error.response?.data,

        message:
          error.message,

        url:
          error.config?.baseURL +
          error.config?.url,
      }
    );


    const detail =
      error.response?.data?.detail;


    // Backend returned simple error message
    if (
      typeof detail === "string"
    ) {
      throw new Error(
        detail
      );
    }


    // FastAPI validation error
    if (
      Array.isArray(detail)
    ) {

      const message =
        detail
          .map(
            (item: any) =>
              item?.msg ||
              "Invalid input"
          )
          .join(", ");


      throw new Error(
        message
      );
    }


    // Backend could not be reached
    if (!error.response) {
      throw new Error(
        "Unable to connect to the backend API."
      );
    }


    throw new Error(
      `Registration failed (${error.response.status}).`
    );
  }
}


// =========================================================
// LOGIN
// =========================================================

export async function loginUser(
  data: LoginData
): Promise<AuthResponse> {

  try {

    const response =
      await API.post<AuthResponse>(
        "/login",
        data
      );


    const result =
      response.data;


    // Support both possible backend names.
    const token =
      result.access_token ||
      result.token;


    if (!token) {
      throw new Error(
        "Authentication token was not returned."
      );
    }


    // =====================================================
    // CLEAR PREVIOUS USER WORKSPACE
    // =====================================================

    /*
     * Important:
     *
     * Suppose User A selected:
     *
     * Engineering Agent
     *
     * and then User B logs in using the
     * same browser.
     *
     * User B should NOT automatically
     * inherit User A's selected workspace.
     */

    if (
      typeof window !== "undefined"
    ) {

      localStorage.removeItem(
        "selected_agent_id"
      );

      localStorage.removeItem(
        "selected_document_id"
      );

      localStorage.removeItem(
        "selected_repository_id"
      );


      // Remove old token key if it exists.
      // We now consistently use access_token.
      localStorage.removeItem(
        "token"
      );


      localStorage.setItem(
        "access_token",
        token
      );


      
      if (result.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            result.user
          )
        );

      } else {

        
        localStorage.removeItem(
          "user"
        );
      }
    }


    return result;

  } catch (error: any) {

    console.error(
      "LOGIN API ERROR:",
      {
        status:
          error.response?.status,

        data:
          error.response?.data,

        message:
          error.message,

        url:
          error.config?.baseURL +
          error.config?.url,
      }
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

      const message =
        detail
          .map(
            (item: any) =>
              item?.msg ||
              "Invalid input"
          )
          .join(", ");


      throw new Error(
        message
      );
    }


    if (!error.response) {
      throw new Error(
        "Unable to connect to the backend API."
      );
    }


    throw new Error(
      error.message ||
      "Login failed."
    );
  }
}




export function logoutUser() {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  
  localStorage.removeItem(
    "access_token"
  );


  
  localStorage.removeItem(
    "token"
  );




  localStorage.removeItem(
    "selected_agent_id"
  );

  localStorage.removeItem(
    "selected_document_id"
  );

  localStorage.removeItem(
    "selected_repository_id"
  );


  // User information
  localStorage.removeItem(
    "user"
  );
}



export function getToken():
  string | null {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "access_token"
  );
}




export function isAuthenticated():
  boolean {

  return Boolean(
    getToken()
  );
}


// =========================================================
// GET CURRENT USER
// =========================================================

export function getCurrentUser() {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }


  const user =
    localStorage.getItem(
      "user"
    );


  if (!user) {
    return null;
  }


  try {

    return JSON.parse(
      user
    );

  } catch {

    localStorage.removeItem(
      "user"
    );

    return null;
  }
}