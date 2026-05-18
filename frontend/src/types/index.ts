export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  text: string;
}

export interface UploadedFile {
  name: string;
  size: number;
}

export interface UploadResponse {
  success: boolean;
  files?: UploadedFile[];
  error?: string;
}

export interface QueryResponse {
  answer: string;
}
