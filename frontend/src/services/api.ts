import { UploadedFile, UploadResponse, QueryResponse } from '../types';

export async function uploadDocuments(files: File[]): Promise<UploadResponse> {
  const form = new FormData();
  files.forEach(file => form.append('documents', file));

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: form
    });

    return await response.json();
  } catch (error) {
    return { success: false, error: 'Could not connect to the upload service.' };
  }
}

export async function queryChat(query: string): Promise<QueryResponse> {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    return await response.json();
  } catch (error) {
    return { answer: 'Could not connect to the chat service.' };
  }
}
