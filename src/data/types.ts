export interface User {
  id: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash' | 'salt'>;
  token: string;
}

export interface Repository {
  id: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: number; 
  updatedAt: number;
  userId: string;
}

export interface RepositoryInput {
  repoPath: string;
}

// export interface GitHubRepository {
//   owner: {
//     login: string;
//   };
//   name: string;
//   html_url: string;
//   stargazers_count: number;
//   forks_count: number;
//   open_issues_count: number;
//   created_at: string;
// }
