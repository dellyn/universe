export interface RepositoryPathResult {
  isValid: boolean;
  owner: string;
  repo: string;
}

export const validateRepositoryPath = (input: string): RepositoryPathResult => {
  // Default invalid result
  const invalidResult: RepositoryPathResult = { isValid: false, owner: '', repo: '' };
  
  if (!input) return invalidResult;
  
  // Check for GitHub URL format
  if (input.includes('github.com')) {
    try {
      const url = new URL(input);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      if (pathParts.length < 2) return invalidResult;
      
      return {
        isValid: true,
        owner: pathParts[0],
        repo: pathParts[1]
      };
    } catch (error) {
      return invalidResult;
    }
  }
  
  // Check for owner/repo format
  const parts = input.split('/');
  if (parts.length !== 2) return invalidResult;
  
  const [owner, repo] = parts;
  if (!owner || !repo) return invalidResult;
  
  // Validate format with regex
  const regex = /^[a-zA-Z0-9_.-]+$/;
  if (!regex.test(owner) || !regex.test(repo)) return invalidResult;
  
  return {
    isValid: true,
    owner,
    repo
  };
};

export const formatRepositoryPath = (input: string): string => {
  const result = validateRepositoryPath(input);
  return result.isValid ? `${result.owner}/${result.repo}` : input;
}; 