export type Meta<T = unknown> = Record<string, T>;
export type StringDateISO = string;
export type StringDateUnix = string;
export type SortOrder = 'ascending' | 'descending';
export type FilePath = string;
export type AbsFilePath = string;
export type DirPath = string;
export type AbsDirPath = string;
export type DirName = string;
export type FileName = string;
export type DocumentID = string;
export type FieldName = string;
export type FileNameWithExt = string;
export type QuerySelectorString = string;
export type TsconfigFile = {
  compilerOptions?: {
    paths?: {
      [alias: string]: string | string[];
    };
  };
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export enum LogLevel {
  always = 'always',
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export interface ExtendedError extends Error {
  id: string;
  type: string;
  level: LogLevel;
  meta?: Meta;
}

export enum Mode {
  development = 'development',
  testing = 'testing',
  production = 'production',
}