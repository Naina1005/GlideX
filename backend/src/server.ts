import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload';
import chatRoutes from './routes/chat';
import { initializeVectorDb } from './services/vectorDb';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/upload', uploadRoutes);
app.use('/api/query', chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', provider: 'faiss-rag' });
});

// Initialize server
async function startServer() {
  try {
    // Initialize vector database
    await initializeVectorDb();
    console.log('Vector database initialized');

    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
      console.log('LLM Provider: Ollama (Local)');
      console.log(`Ollama Base URL: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);
      console.log(`Ollama Model: ${process.env.OLLAMA_MODEL || 'llama2'}`);
      console.log('Make sure to run: ollama run llama2 (or your chosen model)');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
