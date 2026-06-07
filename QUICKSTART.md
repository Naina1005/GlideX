# 🚀 RAG Chatbot - Quick Start (100% FREE)

## ⚡ 5-Minute Setup

### Step 1: Download Ollama (One-time)
```
Visit: https://ollama.ai
Download & Install for your OS
```

### Step 2: Download an AI Model
```bash
ollama pull llama2
# (Takes 2-5 mins, ~4GB)
```

### Step 3: Verify Installation
```bash
ollama run llama2
# Type: "hello"
# Press: Ctrl+D to exit
```

### Step 4: Setup Backend
```bash
cd backend
npm install
# Wait ~30 seconds
```

### Step 5: Create .env (Optional - Already Configured!)
```bash
cp .env.example .env
# Nothing to edit! It's ready to go.
```

### Step 6: Start Services

**Terminal 1**:
```bash
ollama serve
# Leave running
```

**Terminal 2**:
```bash
cd backend
npm run dev
# Backend on http://localhost:4000
```

**Terminal 3**:
```bash
cd frontend
npm run dev
# Frontend on http://localhost:5173
```

---

## ✨ Done! Here's What You Have

✅ **100% Free** - No API keys, no monthly bills  
✅ **Private** - Everything runs on your computer  
✅ **Offline** - Works without internet  
✅ **Fast** - Responses in seconds  
✅ **Smart** - AI-powered document analysis  

---

## 📝 How to Use

### Upload & Analyze
1. Click **+** button
2. Select a PDF/TXT/MD file
3. Click **Upload**
→ Get document summary, key points, topics

### Upload & Ask
1. Click **+** button  
2. Select file
3. Type your question
4. Click **Upload**
→ Document analyzed + your question answered

### Ask Follow-up Questions
1. Type in query box
2. Send
→ Get answer based on uploaded documents

---

## 📚 Documentation

- **Full Setup**: See [OLLAMA_SETUP.md](OLLAMA_SETUP.md)
- **Backend Guide**: See [backend/README.md](backend/README.md)
- **Complete Setup**: See [SETUP.md](SETUP.md)

---

## 🎯 Model Options

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| neural-chat | 3GB | ⚡⚡⚡ | ⭐⭐⭐ | Limited RAM |
| **llama2** | **4GB** | **⚡⚡** | **⭐⭐⭐⭐** | **Recommended** |
| mistral | 5GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Speed lovers |
| dolphin-mixtral | 26GB | ⚡ | ⭐⭐⭐⭐⭐ | Power users |

---

## ❓ Common Issues

### "Connection refused"
→ Make sure `ollama serve` is running in Terminal 1

### "Model not found"
→ Run: `ollama pull llama2`

### "Out of memory"
→ Use smaller model: `ollama pull neural-chat`

### "Backend won't start"
→ Check Ollama is running: `curl http://localhost:11434`

---

## 🎉 You're Ready!

Your RAG chatbot is fully functional and 100% free!

Visit: **http://localhost:5173**

Enjoy! 🚀

---

## Advanced: Change Models

```bash
# Try faster model
ollama pull mistral

# Update .env:
OLLAMA_MODEL=mistral

# Restart backend
```

---

## 📊 System Requirements

- **Minimum**: 4GB RAM, 10GB disk
- **Recommended**: 8GB RAM, 20GB disk  
- **Optimal**: 16GB RAM, 50GB disk

---

**Questions?** Check [OLLAMA_SETUP.md](OLLAMA_SETUP.md) for detailed troubleshooting!
