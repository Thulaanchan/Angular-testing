export interface OperationResult<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
