# 🚀 GlobalAssist - Quick Start

## ⚡ Super Fast Setup

### 1. Extract Package
```bash
tar -xzf GlobalAssist-FINAL-FIXED.tar.gz
cd GlobalAssist
```

### 2. Backend Setup (2 minutes)
```bash
cd backend

# Install
pip install -r requirements.txt

# Configure
# Edit .env and add your API key:
# OPENAI_API_KEY=sk-xxxxx
# (Get from: https://platform.openai.com/api-keys)

# Run
python app.py
```

✅ Backend running on http://localhost:5000

### 3. Frontend Setup (1 minute)
```bash
cd frontend

# Install
npm install

# Run
npm run dev
```

✅ Frontend running on http://localhost:5173

### 4. Open & Test
```
🌐 Open: http://localhost:5173

1. Type a message (no login needed!)
2. Select "GPT-3.5 Turbo" from dropdown (top-right)
3. Type: "Create a Python function to add two numbers"
4. Click send
5. See AI-generated code! ✅
```

## 🎯 What's Included

✅ **All bugs fixed:**
- GPT-3.5 works correctly
- OAuth routes added
- Model names corrected
- Backend matches frontend

✅ **All features:**
- Chat without login
- File upload (photos & PDFs)
- 6 AI models
- OAuth login (Google & GitHub)
- History management
- Simple JSON storage

## 📋 Optional: Setup GitHub Login

1. Go to: https://github.com/settings/developers
2. New OAuth App:
   - Name: GlobalAssist
   - Homepage: http://localhost:5173
   - Callback: http://localhost:5000/api/auth/github/callback
3. Copy Client ID & Secret
4. Add to `backend/.env`:
   ```bash
   GITHUB_CLIENT_ID=xxxxx
   GITHUB_CLIENT_SECRET=xxxxx
   ```
5. Restart backend
6. Done! GitHub login works ✅

## 📖 Full Documentation

- `README.md` - Complete setup guide
- `CHANGELOG.md` - All fixes & changes

## ✨ That's It!

Start coding with AI! 🎉

---

Need help? Check README.md for detailed instructions.
