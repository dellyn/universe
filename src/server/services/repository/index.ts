import { Repository } from '@data/types';
import { RepositoryModel } from '@models/repository';
import { PaginationParams, PaginatedResponse } from '@libraries/interfaces/pagination';
import { AppError } from '@packages/framework';
import { ErrorKeys } from '@data/types';
import { StatusCodes } from 'http-status-codes';
import { githubService as contentService} from './githubService';

export const repositoryService = {
  addRepository: async (userId: string, repoPath: string): Promise<Repository> => {
    const [owner, name] = repoPath.split('/');
    
    if (!owner || !name) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        messageKey: ErrorKeys.REPO_INVALID_PATH,
        message: 'Invalid repository path format. Use "owner/repo"'
      });
    }
    
    const existingRepo = await RepositoryModel.findByUserIdAndRepoPath(userId, owner, name);
    if (existingRepo) {
      throw new AppError({
        code: StatusCodes.CONFLICT,
        messageKey: ErrorKeys.CONFLICT,
        message: 'Repository already exists in your list'
      });
    }
    
    const repoInfo = await contentService.fetchRepositoryInfo(repoPath);
    
    return await RepositoryModel.create({
      ...repoInfo,
      userId
    });
  },
  
  getUserRepositories: async (userId: string, pagination?: PaginationParams): Promise<Repository[]> => {
    return await RepositoryModel.findByUserId(userId, pagination);
  },
  
  getPaginatedUserRepositories: async (userId: string, pagination: PaginationParams): Promise<PaginatedResponse<Repository>> => {
    return await RepositoryModel.getPaginatedByUserId(userId, pagination);
  },
  
  getRepository: async (userId: string, repoId: string): Promise<Repository> => {
    const repository = await RepositoryModel.findById(repoId);
    
    if (!repository) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        messageKey: ErrorKeys.REPO_NOT_FOUND,
        message: 'Repository not found'
      });
    }
    
    if (repository.userId !== userId) {
      throw new AppError({
        code: StatusCodes.FORBIDDEN,
        messageKey: ErrorKeys.FORBIDDEN,
        message: 'You do not have access to this repository'
      });
    }
    
    return repository;
  },
  
  updateRepository: async (userId: string, repoId: string): Promise<Repository> => {
    const repository = await repositoryService.getRepository(userId, repoId);
    
    const repoPath = `${repository.owner}/${repository.name}`;
    const updatedInfo = await contentService.fetchRepositoryInfo(repoPath);
    
    const updatedRepo = await RepositoryModel.update(repoId, updatedInfo);
    
    if (!updatedRepo) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        messageKey: ErrorKeys.REPO_NOT_FOUND,
        message: 'Repository not found'
      });
    }
    
    return updatedRepo;
  },
  
  deleteRepository: async (userId: string, repoId: string): Promise<void> => {
    await repositoryService.getRepository(userId, repoId);
    
    const deleted = await RepositoryModel.delete(repoId);
    
    if (!deleted) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        messageKey: ErrorKeys.REPO_NOT_FOUND,
        message: 'Repository not found'
      });
    }
  }
}; 