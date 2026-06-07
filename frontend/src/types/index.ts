export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  text: string;
}

export interface UploadedFile {
  name: string;
  size: number;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  topics: string[];
}

export interface QuerySource {
  content: string;
  filename: string;
  relevance: number;
}

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  filename?: string;
  fileSize?: number;
  documentsCount?: number;
  chunksCount?: number;
  analysis?: DocumentAnalysis;
  answer?: QueryResponse;
  files?: UploadedFile[];
  message?: string;
  error?: string;
}

export interface QueryResponse {
  answer: string;
  sources?: QuerySource[];
  query?: string;
  success?: boolean;
}
