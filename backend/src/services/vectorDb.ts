import * as fs from 'fs';
import * as path from 'path';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { Document } from 'langchain/document';

const VECTOR_DB_PATH = path.join(__dirname, '../../vectordb');
const METADATA_PATH = path.join(VECTOR_DB_PATH, 'metadata.json');

interface DocumentMetadata {
  [key: string]: {
    filename: string;
    uploadedAt: string;
    contentHash: string;
  };
}

let vectorStore: FaissStore | null = null;
let documentMetadata: DocumentMetadata = {};

// Ensure vectordb directory exists
if (!fs.existsSync(VECTOR_DB_PATH)) {
  fs.mkdirSync(VECTOR_DB_PATH, { recursive: true });
}

// Load existing metadata
if (fs.existsSync(METADATA_PATH)) {
  documentMetadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
}

/**
 * Initialize the vector database with existing embeddings if available
 */
export async function initializeVectorDb(): Promise<void> {
  try {
    // Use local Ollama embeddings
    const embeddings = new OllamaEmbeddings({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
      model: process.env.OLLAMA_MODEL || 'llama2',
    });

    // Try to load existing vector store
    const indexPath = path.join(VECTOR_DB_PATH, 'faiss.index');
    const docsPath = path.join(VECTOR_DB_PATH, 'docs.json');

    if (fs.existsSync(indexPath) && fs.existsSync(docsPath)) {
      vectorStore = await FaissStore.load(VECTOR_DB_PATH, embeddings);
      console.log('Vector DB loaded from disk');
    } else {
      // Create new empty vector store; it will initialize when documents are added.
      vectorStore = new FaissStore(embeddings, {});
      console.log('New empty vector DB initialized');
    }
  } catch (error) {
    console.error('Error initializing vector DB:', error);
    throw error;
  }
}

/**
 * Add documents to the vector database
 */
export async function addDocumentsToDb(
  documents: Document[],
  documentId: string,
  filename: string
): Promise<void> {
  if (!vectorStore) {
    throw new Error('Vector DB not initialized');
  }

  // Add document ID and filename to metadata
  documents.forEach((doc) => {
    doc.metadata = {
      ...doc.metadata,
      documentId,
      filename,
    };
  });

  // Add to vector store
  await vectorStore.addDocuments(documents);

  // Save vector store
  await vectorStore.save(VECTOR_DB_PATH);

  // Update metadata
  const contentHash = generateHash(documents.map((d) => d.pageContent).join(''));
  documentMetadata[documentId] = {
    filename,
    uploadedAt: new Date().toISOString(),
    contentHash,
  };
  fs.writeFileSync(METADATA_PATH, JSON.stringify(documentMetadata, null, 2));

  console.log(`Added ${documents.length} documents to vector DB`);
}

/**
 * Search for similar documents using semantic search
 */
export async function semanticSearch(
  query: string,
  k: number = 5
): Promise<Array<{ content: string; metadata: any; score: number }>> {
  if (!vectorStore) {
    throw new Error('Vector DB not initialized');
  }

  const results = await vectorStore.similaritySearchWithScore(query, k);

  return results.map(([doc, score]) => ({
    content: doc.pageContent,
    metadata: doc.metadata,
    score,
  }));
}

/**
 * Get all documents metadata
 */
export function getDocumentsMetadata(): DocumentMetadata {
  return documentMetadata;
}

/**
 * Delete document from vector DB
 */
export async function deleteDocument(documentId: string): Promise<void> {
  if (!vectorStore) {
    throw new Error('Vector DB not initialized');
  }

  // Note: FAISS doesn't have a built-in delete method
  // You would need to rebuild the index without the deleted document
  // For now, we'll just update metadata
  delete documentMetadata[documentId];
  fs.writeFileSync(METADATA_PATH, JSON.stringify(documentMetadata, null, 2));

  console.log(`Marked document ${documentId} as deleted`);
}

/**
 * Simple hash function for content verification
 */
function generateHash(content: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Clear all data (useful for testing)
 */
export async function clearVectorDb(): Promise<void> {
  if (fs.existsSync(VECTOR_DB_PATH)) {
    fs.rmSync(VECTOR_DB_PATH, { recursive: true });
  }
  vectorStore = null;
  documentMetadata = {};
  await initializeVectorDb();
}
