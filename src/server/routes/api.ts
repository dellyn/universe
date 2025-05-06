import { authController } from '@controllers/auth';
import { ApiEndpoints } from '@data/apiInterface';
import { requireAuthMiddleware } from '../middlewares';
import { Router } from '@packages/framework';
import { requireVerifiedEmailMiddleware } from '../middlewares';
import { repositoryRouter } from '@routes/repository';

export const API_ENDPOINT = '/api/v1';
export const apiRouter = Router();

apiRouter.post(ApiEndpoints.Register, authController.register);
apiRouter.post(ApiEndpoints.Login, authController.login);
apiRouter.post(ApiEndpoints.RefreshToken, authController.refreshToken);
apiRouter.post(ApiEndpoints.Logout, requireAuthMiddleware, authController.logout);

apiRouter.post(ApiEndpoints.VerifyEmailCode, requireAuthMiddleware, authController.verifyEmailCode);
apiRouter.post(ApiEndpoints.ResendVerification, requireAuthMiddleware, authController.resendVerificationEmail);

apiRouter.use(ApiEndpoints.Repositories, requireAuthMiddleware, requireVerifiedEmailMiddleware, repositoryRouter);

