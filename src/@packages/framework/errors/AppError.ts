export interface AppErrorOptions {
  code?: number;
  messageKey: string;
  message?: string;
  data?: Record<string, any>;
}

export class AppError extends Error {
  code: number;
  messageKey: string;
  data?: Record<string, any>;

  constructor(options: AppErrorOptions) {
    super(options.message || options.messageKey);
    this.name = 'AppError';
    this.code = options.code || 500;
    this.messageKey = options.messageKey;
    this.data = options.data;
  }
} 