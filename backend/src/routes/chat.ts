import express, { Router, Request, Response } from 'express';
import { answerQuery } from '../services/semanticSearch';
import { getDocumentsMetadata } from '../services/vectorDb';

const router = Router();

interface QueryRequest extends Request {
  body: {
    query: string;
  };
}

/**
 * Query the chatbot with a question
 * POST /api/query
 */
router.post('/', async (req: QueryRequest, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // Check if documents are available
    const metadata = getDocumentsMetadata();
    if (Object.keys(metadata).length === 0) {
      res.status(400).json({
        error: 'No documents uploaded yet. Please upload a document first.',
      });
      return;
    }

    console.log(`Processing query: ${query}`);

    // Answer the query
    const result = await answerQuery(query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Query error:', error);
    res.status(500).json({
      error: error.message || 'Error processing query',
    });
  }
});

/**
 * Get documents metadata
 * GET /api/query/documents
 */
router.get('/documents', (_req: Request, res: Response) => {
  try {
    const metadata = getDocumentsMetadata();
    res.status(200).json({
      success: true,
      documents: metadata,
      count: Object.keys(metadata).length,
    });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      error: error.message || 'Error fetching documents',
    });
  }
});

export default router;
