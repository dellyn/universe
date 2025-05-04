import { userController } from "@controllers/userController";
import { ApiEndpointsPrefix, ApiRoute } from "@interfaces/api";

const endpoint = ApiEndpointsPrefix + '/auth';

export const authRoutes: ApiRoute[] = [
    { method: 'POST', path: `${endpoint}/register`, handler: userController.register },
    { method: 'POST', path: `${endpoint}/login`, handler: userController.login },
    { method: 'POST', path: `${endpoint}/logout`, handler: userController.logout },
    { method: 'POST', path: `${endpoint}/refresh`, handler: userController.refreshToken },
]