# Using Ollama with RAG Chatbot (FREE & LOCAL)

Ollama is a **completely free, open-source LLM** that runs on your computer. No API keys, no monthly bills, no internet required!

## ✅ Why Ollama?

- **Free Forever** - No costs whatsoever
- **Runs Locally** - On your machine, offline-capable
- **No API Keys** - Nothing to configure
- **Private** - Your documents never leave your computer
- **Fast** - Decent response times
- **Easy Setup** - One command to get started
- **Great Models** - Access to LLaMA, Mistral, and more

## 📥 Step 1: Install Ollama

### Windows/Mac
1. Visit **https://ollama.ai**
2. Click "Download" and select your OS
3. Run the installer
4. Ollama will start automatically

### Linux
```bash
curl https://ollama.ai/install.sh | sh
```

Verify installation:
```bash
ollama --version
```

## 🚀 Step 2: Download a Model

Open your terminal and run one of these commands:

### Option A: LLaMA 2 (Recommended - Good Balance)
```bash
ollama pull llama2
```
- Size: ~4GB
- Speed: Good
- Quality: Very good
- Best for: General use

### Option B: Mistral (Fast & Efficient)
```bash
ollama pull mistral
```
- Size: ~5GB
- Speed: Very fast
- Quality: Good
- Best for: Quick responses

### Option C: Neural Chat (Lightweight)
```bash
ollama pull neural-chat
```
- Size: ~3GB
- Speed: Fast
- Quality: Good
- Best for: Limited resources

### Option D: Dolphin Mixtral (Advanced)
```bash
ollama pull dolphin-mixtral
```
- Size: ~26GB
- Speed: Medium
- Quality: Excellent
- Best for: Power users

**Pick one option and wait for it to download** (~5-15 mins depending on speed)

## ✅ Step 3: Verify Ollama Works

Open terminal and test:
```bash
ollama run llama2
```

Type a test message:
```
What is 2+2?
```

Press Ctrl+D to exit. If you see a response, you're good!

## 🔧 Step 4: Configure Backend

### A. Update .env file

In `backend/.env`:
```
PORT=4000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
VECTOR_DB_PATH=./vectordb
```

### B. Change model (if you picked a different one)

If you downloaded "mistral" instead, change:
```
OLLAMA_MODEL=mistral
```

## 🏃 Step 5: Run Everything

### Terminal 1: Start Ollama (if not already running)
```bash
ollama serve
# Or just: ollama run llama2
```

### Terminal 2: Start Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

## 📊 Model Comparison

| Model | Size | Speed | Quality | RAM |
|-------|------|-------|---------|-----|
| neural-chat | 3GB | ⚡⚡⚡ | ⭐⭐⭐ | 4GB |
| llama2 | 4GB | ⚡⚡ | ⭐⭐⭐⭐ | 8GB |
| mistral | 5GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | 8GB |
| dolphin-mixtral | 26GB | ⚡ | ⭐⭐⭐⭐⭐ | 32GB |

## 🎯 How to Use

1. **Upload Document**
   - Click + button
   - Select PDF/TXT file
   - Optionally add a question
   - Click upload

2. **Ask Questions**
   - Type in query box
   - Send
   - Get answers based on your documents

3. **No API Key Needed** ✓
   - Everything runs locally
   - Your data stays private

## ⚙️ Advanced: Managing Ollama Models

### List downloaded models
```bash
ollama list
```

### Delete a model
```bash
ollama rm llama2
```

### Run different model temporarily
```bash
ollama run mistral
```

### Serve custom port
```bash
ollama serve --listen 0.0.0.0:11434
```

## 🐛 Troubleshooting

### "Failed to connect to Ollama"
- Ensure Ollama is running: `ollama serve` or `ollama run llama2`
- Check port 11434 is accessible
- Try: `curl http://localhost:11434`

### "Model not found"
- Download the model: `ollama pull llama2`
- Update OLLAMA_MODEL in .env

### "Out of memory" error
- Choose a smaller model (neural-chat)
- Close other apps
- Increase swap/virtual memory

### Backend starts but responses are slow
- This is normal - models run slower than cloud APIs
- Reduce document chunk size for faster processing
- Use mistral instead of llama2

### Ollama won't start on Windows
- Try: Run PowerShell as Administrator
- Ensure ~15GB free disk space
- Reinstall if necessary

## 💡 Tips for Best Performance

1. **Close unnecessary apps** - Frees up RAM
2. **Use mistral** - Faster than llama2
3. **Smaller chunks** - Edit `documentParser.ts`:
   ```typescript
   chunkSize: 300  // default: 500
   ```
4. **Fewer search results** - Edit `vectorDb.ts`:
   ```typescript
   k: 3  // default: 5
   ```

## 🔄 Upgrading Models

To try a better model:
```bash
ollama pull mistral
```

Update `.env`:
```
OLLAMA_MODEL=mistral
```

Restart backend - That's it!

## 🌐 Using Cloud Alternative (If Needed)

If you want cloud LLM but free:

### Option 1: HuggingFace Inference API (Free)
1. Visit https://huggingface.co/join
2. Create account
3. Create API token
4. Install: `npm install @huggingface/inference`

### Option 2: LM Studio (Similar to Ollama)
- Easier UI: https://lmstudio.ai
- Same local models

### Option 3: Together AI (Free tier)
- Cloud hosted
- Free tier available
- Better for weak computers

## ✨ Keep Ollama Running

### Windows
- Ollama starts automatically on boot
- Keep running in background

### Mac
- Runs as background service
- Menu bar icon

### Linux
```bash
# Make it start on boot
sudo systemctl enable ollama
```

## 📚 Learning More

- Ollama Docs: https://github.com/ollama/ollama
- Model Library: https://ollama.ai/library
- LangChain Docs: https://js.langchain.com

## 🎉 You're All Set!

Your RAG chatbot is now:
- ✅ Completely free
- ✅ Running locally
- ✅ Using AI models offline
- ✅ Processing documents with semantic search
- ✅ No API keys or monthly bills

Enjoy! 🚀
