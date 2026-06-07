# RAG Chatbot - Complete Setup Guide

## 🎉 Good News: FREE & LOCAL LLM!

This project uses **Ollama** - a completely free, open-source LLM that runs locally on your computer. **No API keys needed!**

See [OLLAMA_SETUP.md](OLLAMA_SETUP.md) for complete Ollama installation guide.

## Quick Start

### 1. Install Ollama (One-time setup)
```bash
# Download from https://ollama.ai
# Run installer
# Then download a model:
ollama pull llama2
# or: ollama pull mistral
```

### 2. Start Ollama
```bash
ollama serve
# Or in another way: ollama run llama2
```

### 3. Backend Setup

```bash
cd backend
npm install

# Create .env file (no API key needed!)
cp .env.example .env
```

Your `.env` will look like:
```
PORT=4000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
VECTOR_DB_PATH=./vectordb
```

### 4. Start Backend
```bash
npm run dev
```

Backend runs at: `http://localhost:4000`

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## ✅ You're Ready!

- ✅ Upload documents (PDF, TXT, MD)
- ✅ Get AI analysis (summary, key points, topics)
- ✅ Ask questions with semantic search
- ✅ Completely FREE - No API keys!
- ✅ Private - Everything runs locally

## Backend Setup (Detailed)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create `.env.local` (optional)
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:4000
```

### 3. Start Frontend
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## How to Use

### Upload Document
1. Click the **+** button in the frontend
2. Select a PDF, TXT, or MD file
3. **Option A - Analyze Only**: Click upload (documents will be analyzed)
4. **Option B - Ask Question**: Type a query in the input field, then upload

### Query Documents
1. Type your question in the query input
2. Click send
3. The chatbot will search through uploaded documents and answer

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload` | Upload document (with optional query) |
| POST | `/api/query` | Ask a question about documents |
| GET | `/api/query/documents` | List all uploaded documents |
| GET | `/api/health` | Health check |

## Workflow Examples

### Example 1: Upload and Analyze
```bash
curl -X POST http://localhost:4000/api/upload \
  -F "file=@research_paper.pdf"
```
Response includes:
- Document summary
- Key points
- Main topics

### Example 2: Upload and Ask Question
```bash
curl -X POST http://localhost:4000/api/upload \
  -F "file=@research_paper.pdf" \
  -F "query=What is the main conclusion?"
```
Response includes:
- Document analysis
- Answer to your question
- Source citations

### Example 3: Ask Follow-up Question
```bash
curl -X POST http://localhost:4000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Can you elaborate on the methodology?"}'
```

## Project Structure

```
rag-chatbot/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── upload.ts
│   │   │   └── chat.ts
│   │   └── services/
│   │       ├── vectorDb.ts
│   │       ├── documentParser.ts
│   │       └── semanticSearch.ts
│   ├── vectordb/          (auto-created)
│   ├── package.json
│   ├── .env               (create from .env.example)
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWindow.tsx
    │   │   ├── DocumentUpload.tsx
    │   │   └── QueryInput.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## Features

### Backend
- ✅ PDF, TXT, MD document support
- ✅ FAISS vector database for embeddings
- ✅ Document chunking with overlap
- ✅ AI-powered document analysis
- ✅ Semantic search with context
- ✅ OpenAI LLM integration
- ✅ Dual mode: analyze-only or analyze+query

### Frontend
- ✅ Drag-and-drop file upload
- ✅ Query input with optional query on upload
- ✅ Real-time responses
- ✅ Source citation display
- ✅ Chat history

## Troubleshooting

### Backend fails to start
```
Error: "Vector DB not initialized"
Solution: Check OPENAI_API_KEY is set in .env
```

### Upload fails
```
Error: "No documents uploaded yet"
Solution: Ensure your file is PDF, TXT, or MD format
```

### Slow responses
- Check file size (>50MB files may be slow)
- Verify OpenAI API rate limits
- Check your internet connection

### Frontend can't reach backend
```
Error: "Could not connect to the upload service"
Solution: 
1. Verify backend is running on port 4000
2. Check .env.local has correct API URL
3. Ensure CORS is enabled
```

## Advanced Configuration

### Change LLM Model
Edit `backend/src/services/semanticSearch.ts`:
```typescript
modelName: 'gpt-4' // or 'gpt-3.5-turbo'
```

### Adjust Chunking
Edit `backend/src/services/documentParser.ts`:
```typescript
chunkSize: 1000    // words per chunk
overlap: 200       // overlap between chunks
```

### Adjust Search Results
Edit `backend/src/services/vectorDb.ts`:
```typescript
k: 10  // return 10 most relevant chunks
```

## Performance Tips

1. **Smaller chunks** = better precision, more API calls
2. **Larger chunks** = more context, less precise
3. **More k** = more context, more tokens used
4. **gpt-4** = better quality, more expensive
5. **gpt-3.5-turbo** = faster, cheaper

## Reset Data

To clear all uploaded documents and start fresh:

```bash
# Backend
rm -rf backend/vectordb/

# Then restart the backend
npm run dev
```

## Support

- **LangChain Docs**: https://js.langchain.com
- **OpenAI API**: https://platform.openai.com/docs
- **FAISS**: https://github.com/facebookresearch/faiss
