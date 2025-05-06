export enum ApiEndpoints {
  BaseUrl = '/api/v1',

  // Auth
  Auth = '/auth',
  Register = '/auth/register',
  Login = '/auth/login', 
  Logout = '/auth/logout',
  RefreshToken = '/auth/refresh',
  VerifyEmailCode = '/auth/verify-email-code',
  ResendVerification = '/auth/resend-verification',

  // Repositories
  Repositories = '/repositories',
  Repository = '/repositories/:id',
}
