import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload';
import chatRoutes from './routes/chat';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/query', chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', provider: 'ollama' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
