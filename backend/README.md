# RAG Chatbot Backend

A powerful backend for a Retrieval-Augmented Generation (RAG) chatbot that uses **Ollama** (FREE local LLM) and FAISS vector database for semantic search.

## ✨ Key Features

- **100% Free** - Uses Ollama (no API keys, no fees)
- **Local & Private** - Documents never leave your computer
- **Document Upload**: Support for PDF, TXT, and Markdown files
- **Vector Database**: FAISS-based vector storage for semantic search
- **Document Chunking**: Automatic chunking for optimal embedding and search
- **Document Analysis**: AI-powered analysis of uploaded documents
- **Semantic Search**: Context-aware query answering using embeddings
- **Dual Mode**:
  - Upload without query: Document gets analyzed automatically
  - Upload with query: Document analyzed + query answered immediately

## Architecture

```
Document Upload → Parser → Chunker → Embeddings → FAISS Vector DB
                                                        ↓
                                                   Semantic Search
                                                        ↓
                                                   LLM (OpenAI)
                                                        ↓
                                                      Response
```

## Prerequisites

- Node.js 18+
- npm or yarn
- **Ollama** (Free, open-source LLM) - [Download here](https://ollama.ai)
- ~8GB RAM (depends on model size)
- ~15GB free disk space (for Ollama models)

## Quick Installation

### 1. Install Ollama
Visit https://ollama.ai and download the installer for your OS.

### 2. Download a Model
```bash
ollama pull llama2  # ~4GB, recommended
# OR: ollama pull mistral  # ~5GB, faster
```

### 3. Install Backend Dependencies
```bash
npm install
```

### 4. Create .env File
```bash
cp .env.example .env
```

**Note**: No API key needed! Your `.env` will look like:
```
PORT=4000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
VECTOR_DB_PATH=./vectordb
```

### 5. Start Backend (with Ollama running)
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Backend
npm run dev
```

Backend runs on `http://localhost:4000`

For detailed Ollama setup, see [OLLAMA_SETUP.md](../OLLAMA_SETUP.md).

## Development

### Step 1: Start Ollama
```bash
ollama serve
```
Or simply run:
```bash
ollama run llama2
```

### Step 2: Start Backend (in another terminal)
```bash
npm run dev
```

The backend will start on `http://localhost:4000`

**Note**: Ollama must be running before the backend starts processing requests.

## API Endpoints

### 1. Upload Document

**POST** `/api/upload`

Upload a document with optional query.

**Request**:
- Form data with:
  - `file`: The document file (PDF, TXT, or MD)
  - `query` (optional): A query to answer about the document

**cURL Example**:
```bash
# Upload without query (analyze only)
curl -X POST http://localhost:4000/api/upload \
  -F "file=@document.pdf"

# Upload with query
curl -X POST http://localhost:4000/api/upload \
  -F "file=@document.pdf" \
  -F "query=What are the main topics?"
```

**Response**:
```json
{
  "success": true,
  "documentId": "uuid-here",
  "filename": "document.pdf",
  "fileSize": 12345,
  "documentsCount": 10,
  "chunksCount": 25,
  "analysis": {
    "summary": "Document summary...",
    "keyPoints": ["Point 1", "Point 2"],
    "topics": ["Topic 1", "Topic 2"]
  },
  "answer": {
    "answer": "Answer to query...",
    "sources": [
      {
        "content": "Relevant excerpt...",
        "filename": "document.pdf",
        "relevance": 0.95
      }
    ]
  }
}
```

### 2. Query the Chatbot

**POST** `/api/query`

Query the chatbot about uploaded documents.

**Request**:
```json
{
  "query": "What is the main topic?"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:4000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the key points?"}'
```

**Response**:
```json
{
  "success": true,
  "answer": "The key points are...",
  "query": "What are the key points?",
  "sources": [
    {
      "content": "Relevant excerpt...",
      "filename": "document.pdf",
      "relevance": 0.92
    }
  ]
}
```

### 3. Get Documents Metadata

**GET** `/api/query/documents`

Get list of all uploaded documents.

**Response**:
```json
{
  "success": true,
  "count": 2,
  "documents": {
    "uuid-1": {
      "filename": "document1.pdf",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "contentHash": "abc123..."
    }
  }
}
```

### 4. Health Check

**GET** `/api/health`

Check if the backend is running.

**Response**:
```json
{
  "status": "ok",
  "provider": "faiss-rag"
}
```

## Workflow

### Scenario 1: Document Analysis Only

1. User uploads document without query
2. Document is parsed and chunked
3. Chunks are embedded and stored in FAISS
4. AI analyzes the document and returns:
   - Summary
   - Key points
   - Main topics

### Scenario 2: Document Upload with Query

1. User uploads document with a query
2. Same parsing, chunking, and embedding as above
3. Query is used to search semantically similar chunks
4. LLM receives context from relevant chunks + the query
5. LLM generates an answer with source attribution

### Scenario 3: Query After Upload

1. User uploads documents (with or without initial query)
2. Documents are stored in FAISS
3. User sends new queries via `/api/query`
4. Each query performs semantic search and generates answers

## Configuration

### Environment Variables

```env
# Server port
PORT=4000

# Ollama configuration (FREE & LOCAL)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
# Available models: llama2, mistral, neural-chat, dolphin-mixtral

# Vector DB path (relative to project root)
VECTOR_DB_PATH=./vectordb

# Optional: HuggingFace API Key (leave empty for free tier)
# HF_API_KEY=hf_your_token_here
```

### Changing LLM Models

Edit `.env` OLLAMA_MODEL:
- `llama2` - Best balance, recommended (~4GB)
- `mistral` - Faster responses (~5GB)
- `neural-chat` - Lightweight (~3GB)
- `dolphin-mixtral` - Most capable (~26GB)

To use a different model:
1. Download: `ollama pull mistral`
2. Update `.env`: `OLLAMA_MODEL=mistral`
3. Restart backend

## File Structure

```
backend/
├── src/
│   ├── server.ts          # Express app setup
│   ├── routes/
│   │   ├── upload.ts      # Document upload endpoint
│   │   └── chat.ts        # Query endpoint
│   └── services/
│       ├── vectorDb.ts    # FAISS vector store management
│       ├── documentParser.ts  # PDF/Text parsing
│       └── semanticSearch.ts  # LLM and search logic
├── vectordb/              # Vector store (auto-created)
├── .env                   # Configuration (create from .env.example)
├── package.json
└── tsconfig.json
```

## Storage

- Vector embeddings are stored in `./vectordb/faiss.index`
- Document metadata is stored in `./vectordb/metadata.json`
- Documents are NOT stored on disk (only embeddings)

## Supported Document Types

- **PDF** (.pdf)
- **Text** (.txt)
- **Markdown** (.md)

Maximum file size: 50MB

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing query, no documents, etc.)
- `500`: Server error (parsing, API errors, etc.)

## Performance Tips

1. **Choose right model for your system**:
   - neural-chat (3GB) = Fastest, but lower quality
   - llama2 (4GB) = Good balance, recommended
   - mistral (5GB) = Very fast, good quality
   - dolphin-mixtral (26GB) = Best quality, requires 32GB+ RAM

2. **Optimize document processing**:
   - Smaller chunk size = faster but less context
   - Fewer search results (k=3 instead of 5) = faster
   - Larger documents take longer to parse initially

3. **System optimization**:
   - Close unnecessary applications to free RAM
   - First query after starting Ollama may be slow (model loading)
   - Subsequent queries are much faster
   - Use SSD for better vector DB performance

## Troubleshooting

### "Failed to connect to Ollama"
- Ensure Ollama is running: `ollama serve` or `ollama run llama2`
- Check port 11434: `curl http://localhost:11434`
- Verify OLLAMA_BASE_URL in .env

### "Vector DB not initialized"
- Ensure Ollama is running first
- Check OLLAMA_BASE_URL and OLLAMA_MODEL in .env
- Restart the backend

### "Model not found"
- Download model: `ollama pull llama2`
- Verify model name in .env
- Run `ollama list` to see installed models

### "Out of memory" error
- Choose smaller model: `ollama pull neural-chat`
- Close other applications
- Check available RAM: `free -h` (Linux) or Task Manager (Windows)

### Backend starts but responses are slow
- This is normal for local LLMs
- Mistral is faster than LLaMA 2
- Reduce chunk size in documentParser.ts
- Reduce search results (k parameter in vectorDb.ts)

### No documents uploaded yet
- Upload a document first via `/api/upload`
- Check `vectordb/metadata.json` exists

### "OPENAI_API_KEY not set" error
- Update .env to use Ollama instead:
  ```
  OLLAMA_BASE_URL=http://localhost:11434
  OLLAMA_MODEL=llama2
  ```
- Restart backend

## Dependencies

- **express**: Web framework
- **langchain**: LLM orchestration
- **ollama**: Local LLM service (FREE)
- **@langchain/community**: FAISS integration
- **faiss-node**: Vector database
- **pdf-parse**: PDF parsing
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

**Important**: No OpenAI or paid API dependencies!

## Development Notes

- Vector DB persists across server restarts
- Delete `vectordb/` folder to reset
- Metadata is JSON for easy inspection
- Documents are chunked based on word count, not page breaks

## License

MIT
