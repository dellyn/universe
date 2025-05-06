import { AppError, Response, handleError } from '@packages/framework';
import { StatusCodes } from 'http-status-codes';
import { ErrorKeys } from '@data/types';
import { PaginationParams } from '@libraries/interfaces/pagination';
import { repositoryService } from '@services/repository';
import { AuthenticatedRequest } from '@services/auth/types';

export const repositoryController = {
  addRepository: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const { repoPath } = req.body 
      
      if (!repoPath) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.REPO_INVALID_PATH,
          message: 'Repository path is required'
        });
      }
      
      const repository = await repositoryService.addRepository(req.user.id, repoPath);
      
      res.status(StatusCodes.CREATED).json({ data: repository });
    } catch (error) {
      handleError(error, res, 'Failed to add repository');
    }
  },
  
  getUserRepositories: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const { page = '1', limit = '10' } = req.query;
      
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1 || limitNumber > 50) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.BAD_REQUEST,
          message: 'Invalid pagination parameters'
        });
      }
      
      const pagination: PaginationParams = {
        page: pageNumber,
        limit: limitNumber
      };
      
      const result = await repositoryService.getPaginatedUserRepositories(req.user.id, pagination);
      
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  },
  
  getRepository: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.BAD_REQUEST,
          message: 'Repository ID is required'
        });
      }
      
      const repository = await repositoryService.getRepository(req.user.id, id);
      
      res.json({ data: repository });
    } catch (error) {
      handleError(error, res);
    }
  },
  
  updateRepository: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.BAD_REQUEST,
          message: 'Repository ID is required'
        });
      }
      
      const repository = await repositoryService.updateRepository(req.user.id, id);
      
      res.json({ data: repository });
    } catch (error) {
      handleError(error, res);
    }
  },
  
  deleteRepository: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.BAD_REQUEST,
          message: 'Repository ID is required'
        });
      }
      
      await repositoryService.deleteRepository(req.user.id, id);
      
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      handleError(error, res);
    }
  }
}; 