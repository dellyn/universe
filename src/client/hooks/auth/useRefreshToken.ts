import { publicHttpClient } from "@api/httpClient";
import { ApiEndpoints } from "@data/apiInterface";
import { tokenService } from "@services/accessToken";

/**
 * Hook for refreshing authentication tokens
 */

export const useRefreshToken = () => {
    const refresh = async () => {
      try {
        const response = await publicHttpClient.post(ApiEndpoints.RefreshToken, {}, {
            withCredentials: true
        });
        
        if (response.data.accessToken) {
            tokenService.setToken(response.data.accessToken);
            return {
              accessToken: response.data.accessToken,
              user: response.data.user
            };
        }
        return null;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        tokenService.clearToken();
        return null;
      }
    }
    return { refresh };
};
