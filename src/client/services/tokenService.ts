
let accessToken: string | null = null;

export const tokenService = {
  getToken: (): string | null => {
    return accessToken;
  },
  
  setToken: (token: string | null): void => {
    accessToken = token;
  },
  
  clearToken: (): void => {
    accessToken = null;
  },
  
  // Helper to add token to request headers
  getAuthHeader: (): Record<string, string> | undefined => {
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : undefined;
  }
}; 