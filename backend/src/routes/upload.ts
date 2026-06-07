import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parseDocument, chunkDocument } from '../services/documentParser';
import {
  addDocumentsToDb,
  analyzeDocument,
  processDocument,
} from '../services/semanticSearch';
import { addDocumentsToDb as addToVectorDb } from '../services/vectorDb';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'text/plain' ||
      file.originalname.endsWith('.md')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, and MD files are allowed'));
    }
  },
});

interface UploadRequest extends Request {
  file?: Express.Multer.File;
  body: {
    query?: string;
  };
}

/**
 * Upload document and optionally process with query
 * POST /api/upload
 */
router.post(
  '/',
  upload.single('file'),
  async (req: UploadRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      const { query } = req.body;
      const documentId = uuidv4();

      console.log(
        `Processing document: ${req.file.originalname}, ID: ${documentId}`
      );

      // Parse the document
      const documents = await parseDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      console.log(`Parsed ${documents.length} documents from file`);

      // Chunk documents for better semantic search
      const chunkedDocuments = chunkDocument(documents);

      console.log(
        `Chunked into ${chunkedDocuments.length} pieces for vector DB`
      );

      // Add to vector database
      await addToVectorDb(
        chunkedDocuments,
        documentId,
        req.file.originalname
      );

      // Combine document content for analysis
      const fullContent = documents.map((doc) => doc.pageContent).join('\n\n');

      // Process the document
      const result = await processDocument(fullContent, query);

      res.status(200).json({
        success: true,
        documentId,
        filename: req.file.originalname,
        fileSize: req.file.size,
        documentsCount: documents.length,
        chunksCount: chunkedDocuments.length,
        analysis: result.analysis,
        answer: result.answer || null,
        message: query
          ? 'Document uploaded and query answered'
          : 'Document uploaded and analyzed',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: error.message || 'Error processing document',
      });
    }
  }
);

export default router;
