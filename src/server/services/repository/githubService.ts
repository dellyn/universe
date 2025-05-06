import { AppError } from '@packages/framework';
import { ErrorKeys, Repository } from '@data/types';
import { StatusCodes } from 'http-status-codes';

const GITHUB_API_URL = 'https://api.github.com';
interface GitHubRepository {
  id: number;
  full_name: string;
  html_url: string;
  owner: {
    login: string;
  };
  name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
}

export const githubService = {
  fetchRepositoryInfo: async (repoPath: string): Promise<Omit<Repository, 'addedAt' | 'updatedAt' | 'userId' | 'id'>> => {
    try {
      const [owner, name] = repoPath.split('/');
      
      if (!owner || !name) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.REPO_INVALID_PATH,
          message: 'Invalid repository path format. Use "owner/repo"'
        });
      }
      
      const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${name}`, {
        headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );
      const responseData = await response.json() as GitHubRepository;
      
      return {
        owner: responseData.owner.login,
        name: responseData.name,
        url: responseData.html_url,
        stars: responseData.stargazers_count,
        forks: responseData.forks_count,
        issues: responseData.open_issues_count,
        createdAt: new Date(responseData.created_at).getTime() 
      };
    } catch (error) {
      throw new AppError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        messageKey: ErrorKeys.REPO_FETCH_FAILED,
        message: `Repository ${repoPath} does not exist`
      });
    }
  }
}; 