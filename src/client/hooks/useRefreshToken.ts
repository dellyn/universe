import axios from "axios";
import { tokenService } from "../services/tokenService";

export const useRefreshToken = () => {

    const refresh = async () => {
      try {
        const response = await axios.post('/api/v1/auth/refresh', {}, {
            withCredentials: true
        });
        if (response.data.accessToken) {
            tokenService.setToken(response.data.accessToken);
            return response.data.accessToken 
        }
        return null;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        tokenService.clearToken();
        return null;
      }
    }
    return {refresh};
};
