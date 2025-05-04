import { userController } from "@controllers/userController";
import { ApiEndpointsPrefix } from "@interfaces/api";

const endpoint = ApiEndpointsPrefix + '/user';

export const userRoutes = [
    { 
        method: 'GET', 
        path: `${endpoint}/profile`, 
        handler: userController.getProfile,
        protected: true 
    },
    // { 
    //     method: 'GET', 
    //     path: `${endpoint}/sessions`, 
    //     handler: userController.getUserSessions,
    //     protected: true 
    // },
    // { 
    //     method: 'DELETE', 
    //     path: `${endpoint}/sessions/:sessionId`, 
    //     handler: userController.revokeSession,
    //     protected: true 
    // }
]