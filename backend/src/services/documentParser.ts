import pdfParse from 'pdf-parse';
import { Document } from 'langchain/document';

/**
 * Parse PDF file and return documents
 */
export async function parsePdf(
  fileBuffer: Buffer,
  filename: string
): Promise<Document[]> {
  try {
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    // Split text into chunks (approximate by page breaks)
    const chunks = text
      .split('\n\n')
      .filter((chunk) => chunk.trim().length > 0);

    // Create documents from chunks
    const documents = chunks.map(
      (chunk, index) =>
        new Document({
          pageContent: chunk.trim(),
          metadata: {
            source: filename,
            pageNumber: index + 1,
            type: 'pdf',
          },
        })
    );

    return documents;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error}`);
  }
}

/**
 * Parse text file
 */
export async function parseText(
  fileBuffer: Buffer,
  filename: string
): Promise<Document[]> {
  try {
    const text = fileBuffer.toString('utf-8');

    // Split into paragraphs
    const chunks = text
      .split('\n\n')
      .filter((chunk) => chunk.trim().length > 0);

    const documents = chunks.map(
      (chunk, index) =>
        new Document({
          pageContent: chunk.trim(),
          metadata: {
            source: filename,
            chunkNumber: index + 1,
            type: 'text',
          },
        })
    );

    return documents;
  } catch (error) {
    console.error('Error parsing text:', error);
    throw new Error(`Failed to parse text: ${error}`);
  }
}

/**
 * Parse document based on file type
 */
export async function parseDocument(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<Document[]> {
  if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) {
    return parsePdf(fileBuffer, filename);
  } else if (
    mimeType === 'text/plain' ||
    filename.endsWith('.txt') ||
    filename.endsWith('.md')
  ) {
    return parseText(fileBuffer, filename);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

/**
 * Chunk document into smaller pieces for better semantic search
 */
export function chunkDocument(
  documents: Document[],
  chunkSize: number = 500,
  overlap: number = 100
): Document[] {
  const chunked: Document[] = [];

  documents.forEach((doc) => {
    const text = doc.pageContent;
    const words = text.split(' ');

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');

      if (chunk.trim().length > 0) {
        chunked.push(
          new Document({
            pageContent: chunk,
            metadata: {
              ...doc.metadata,
              chunkIndex: Math.floor(i / (chunkSize - overlap)),
            },
          })
        );
      }
    }
  });

  return chunked;
}
