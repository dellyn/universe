import { userController } from "@controllers/userController";
import { ApiEndpointsPrefix } from "@interfaces/api";

const endpoint = ApiEndpointsPrefix + '/user';

export const userRoutes = [
    { 
        method: 'GET', 
        path: `${endpoint}/profile`, 
        handler: userController.getProfile,
        protected: true 
    }
]