export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Repository {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: number;  // When the GitHub repository was created
  addedAt: number;   // When the user added the repository to our database
  updatedAt?: number;
  userId: string;
  id: string;
}

// TODO: move to translations specific interfaces
export enum ErrorKeys {
  AUTH_REQUIRED = 'auth.required',
  INVALID_CREDENTIALS = 'auth.invalidCredentials',
  INVALID_REFRESH_TOKEN = 'auth.invalidRefreshToken',
  
  USER_NOT_FOUND = 'user.notFound',
  USER_EMAIL_EXISTS = 'user.emailExists',
  USER_EMAIL_PASSWORD_REQUIRED = 'user.emailPasswordRequired',
  USER_EMAIL_NOT_VERIFIED = 'user.emailNotVerified',
  USER_VERIFICATION_TOKEN_INVALID = 'user.verificationTokenInvalid',
  USER_VERIFICATION_TOKEN_EXPIRED = 'user.verificationTokenExpired',
  
  REPO_NOT_FOUND = 'repository.notFound',
  REPO_INVALID_PATH = 'repository.invalidPath',
  REPO_FETCH_FAILED = 'repository.fetchFailed',
  
  INTERNAL_ERROR = 'error.internal',
  BAD_REQUEST = 'error.badRequest',
  UNAUTHORIZED = 'auth.unauthorized',
  FORBIDDEN = 'auth.forbidden',
  NOT_FOUND = 'resource.notFound',
  CONFLICT = 'resource.conflict',
  
  INVALID_PASSWORD = 'password.invalid',
}
