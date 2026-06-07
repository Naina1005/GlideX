import { UploadedFile, UploadResponse, QueryResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function uploadDocument(
  file: File,
  query?: string
): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file, file.name);

  if (query && query.trim()) {
    form.append('query', query);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Upload failed' };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'Could not connect to the upload service.',
    };
  }
}

export async function uploadDocuments(
  files: File[],
  query?: string
): Promise<UploadResponse> {
  const uploadedFiles: UploadedFile[] = [];

  for (const file of files) {
    const result = await uploadDocument(file, query);

    if (!result.success) {
      return {
        success: false,
        error: result.error || `Failed to upload ${file.name}`,
      };
    }

    uploadedFiles.push({ name: file.name, size: file.size });
  }

  return {
    success: true,
    files: uploadedFiles,
    message: 'Files uploaded successfully.',
  };
}

export async function queryChat(query: string): Promise<QueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        answer: error.error || 'Could not process query',
        sources: [],
        query,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      answer: 'Could not connect to the chat service.',
      sources: [],
      query,
    };
  }
}

export async function getDocuments() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query/documents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return await response.json();
  } catch (error) {
    return { documents: {}, count: 0, error: 'Failed to fetch documents' };
  }
}
