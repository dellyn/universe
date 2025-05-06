import { Router } from '@packages/framework';
import { authController } from '@controllers/auth';
import { requireAuthMiddleware } from '@middlewares';
import { ApiEndpoints } from '@data/apiInterface';

export const authRouter = Router();

authRouter.post(ApiEndpoints.Register, authController.register);
authRouter.post(ApiEndpoints.Login, authController.login);
authRouter.post(ApiEndpoints.RefreshToken, authController.refreshToken);
authRouter.post(ApiEndpoints.Logout, requireAuthMiddleware, authController.logout);