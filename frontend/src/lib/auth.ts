// const TOKEN_KEY = "access_token";

// export function getToken(): string | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   return localStorage.getItem(TOKEN_KEY);
// }

// export function setToken(token: string): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.setItem(TOKEN_KEY, token);
// }

// export function removeToken(): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.removeItem(TOKEN_KEY);
// }

// export function isLoggedIn(): boolean {
//   return !!getToken();
// }


const TOKEN_KEY = "access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  // Replaces the previous user's token automatically.
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);

  // Clear user-specific workspace state.
  window.localStorage.removeItem("selected_agent_id");
  window.localStorage.removeItem("selected_document_id");
  window.localStorage.removeItem("selected_repository_id");
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}