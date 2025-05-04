import { userRoutes } from '@routes/userRoutes';
import { authRoutes } from '@routes/authRoutes';
import { ApiRoute } from '@interfaces/api';

export const routes = [
  ...authRoutes,
  ...userRoutes,
] as ApiRoute[]; 