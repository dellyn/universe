export interface AddRepositoryProps {
  onRepositoryAdded: (repoPath: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
} 