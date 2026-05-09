export interface ApiErrorDetails {
  code: string;
  details?: string;
}

export type ApiSuccessResponse<T extends object = Record<string, never>> = {
  status: 'success';
  summary: string;
} & T;

export interface ApiErrorResponse {
  status: 'error';
  summary: string;
  error?: ApiErrorDetails;
}
