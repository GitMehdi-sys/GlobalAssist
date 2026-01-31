# 🌍 GlobalAssist - AI Coding Assistant

<div align="center">

![GlobalAssist Logo](frontend/public/logo.png)

**Your intelligent coding companion powered by multiple AI models**

[![GitHub](https://img.shields.io/badge/GitHub-GitMehdi--sys-181717?style=for-the-badge&logo=github)](https://github.com/GitMehdi-sys)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## 📖 About

GlobalAssist is a modern, full-stack AI coding assistant that helps developers write code faster and smarter. With support for multiple AI models including GPT-3.5, GPT-4, and Claude, GlobalAssist provides intelligent code generation, explanations, and debugging assistance.

### 🎯 Why GlobalAssist?

- **No Login Required** - Start coding immediately without creating an account
- **Multi-Model Support** - Choose from 6 different AI models (Claude, GPT, Gemini)
- **Simple & Fast** - JSON-based storage, no complex database setup
- **OAuth Integration** - Sign in with Google or GitHub in one click
- **File Upload** - Attach images, PDFs, and documents for context
- **Chat History** - Save and revisit your previous conversations
- **Free to Use** - Core features available for free

---

## ✨ Features

### 🤖 AI Models

- **GlobalAssist 4.5** (Claude Sonnet) - Fast and smart (Free)
- **GlobalAssist Opus** (Claude Opus) - Most intelligent (Pro)
- **GPT-4 Turbo** - OpenAI's flagship model (Pro)
- **GPT-3.5 Turbo** - Fast and efficient (Free)
- **CodeLlama 34B** - Open source code model (Free)
- **Gemini Pro** - Google's AI model (Pro)

### 🔐 Authentication

- Email/Password registration and login
- Google OAuth integration
- GitHub OAuth integration
- Session-based authentication with JWT tokens
- Secure password hashing

### 💾 Data Management

- Simple JSON file storage (no database required)
- Chat history with search and filtering
- User profiles and preferences
- Subscription management

### 🎨 User Interface

- Modern dark theme with amber accents
- Responsive design for all devices
- File upload with drag-and-drop
- Real-time code generation
- Syntax highlighting
- Copy to clipboard functionality

---

## 🚀 Demo

### Screenshots

**Home Page - Chat Interface**
```
┌─────────────────────────────────────────────────────────────┐
│  GlobalAssist                          [GPT-3.5 ▼] ⚙️ 👤    │
├─────────────────────────────────────────────────────────────┤
│  📝 New chat     │                                          │
│  💬 Chats        │   Welcome to GlobalAssist!               │
│  📁 Projects     │   How can I help you code today?         │
│  📦 Artifacts    │                                          │
│  💻 Code         │                                          │
│                  │   [📎] Type your message here... [Send]  │
└─────────────────────────────────────────────────────────────┘
```

### Live Demo

Try it out: [Demo Link] (Add your deployed link here)

---

## 📋 Requirements

### Backend
- Python 3.8 or higher
- pip (Python package manager)

### Frontend
- Node.js 16.0 or higher
- npm or yarn

### API Keys (Optional)
- OpenAI API key (for GPT models)
- Anthropic API key (for Claude models)
- Google OAuth credentials (for Google login)
- GitHub OAuth app (for GitHub login)

---

## 🛠️ Installation

### Method 1: Clone from GitHub (Recommended)

#### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/GitMehdi-sys/GlobalAssist.git

# Navigate to project directory
cd GlobalAssist
```

#### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Or on Windows:
copy .env.example .env

# Edit .env file and add your API keys
# nano .env  (or use any text editor)
```

**Required .env variables:**
```bash
FLASK_SECRET_KEY=your-secret-key-change-this
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

**Optional OAuth (for social login):**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
```

#### Step 3: Frontend Setup

```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

**Open your browser:** http://localhost:5173

---

### Method 2: Download Release

1. Go to [Releases](https://github.com/GitMehdi-sys/GlobalAssist/releases)
2. Download the latest `GlobalAssist-vX.X.X.tar.gz`
3. Extract and follow Step 2-4 above

---

## 🔑 Getting API Keys

### OpenAI API Key (Required for GPT models)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)
6. Add to `backend/.env`: `OPENAI_API_KEY=sk-...`

### Anthropic API Key (Required for Claude models)

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys**
4. Create new key
5. Copy the key (starts with `sk-ant-`)
6. Add to `backend/.env`: `ANTHROPIC_API_KEY=sk-ant-...`

### GitHub OAuth (Optional - for GitHub login)

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** GlobalAssist
   - **Homepage URL:** http://localhost:5173
   - **Authorization callback URL:** http://localhost:5000/api/auth/github/callback
4. Click **Register application**
5. Copy **Client ID** and **Client Secret**
6. Add to `backend/.env`

### Google OAuth (Optional - for Google login)

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Create **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: http://localhost:5000/api/auth/google/callback
7. Copy **Client ID** and **Client Secret**
8. Add to `backend/.env`

---

## 📖 Usage

### Basic Usage

1. **Start Chatting** - No login required!
   - Open http://localhost:5173
   - Type your question in the input box
   - Click send or press Enter

2. **Select AI Model** - Click dropdown in top-right corner
   - Choose from 6 available models
   - Free models work without login
   - Pro models require account

3. **Upload Files** - Click the paperclip icon (📎)
   - Upload images, PDFs, documents
   - Provide context for your questions
   - Files shown above input box

4. **Save History** - Sign in to save your chats
   - Click "Sign In" in sidebar
   - Create account or use OAuth
   - Access history from sidebar

### Advanced Features

#### Create Account
```
1. Click "Sign In" in sidebar
2. Click "Sign up"
3. Enter email, password, full name
4. Click "Create account"
```

#### OAuth Login
```
1. Click "Sign In"
2. Click "Continue with Google" or "Continue with GitHub"
3. Authorize the application
4. Automatically redirected and logged in
```

#### View History
```
1. Login to your account
2. Click "Chats" in sidebar
3. Browse your previous conversations
4. Click any chat to view details
```

---

## 🏗️ Project Structure

```
GlobalAssist/
├── backend/                    # Flask Backend
│   ├── app.py                 # Main application file
│   ├── ai_generator.py        # AI model integration
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (create this)
│   └── data/                  # JSON storage (auto-created)
│       ├── users.json
│       ├── sessions.json
│       └── history.json
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── logo.png           # GlobalAssist logo
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── AuthSuccess.jsx
│   │   ├── services/          # API integration
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── aiService.js
│   │   │   ├── paymentService.js
│   │   │   └── historyService.js
│   │   ├── context/           # Global state
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md                   # This file
├── LICENSE                     # MIT License
└── CODE_DOCUMENTATION.md       # Detailed code docs
```

---

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{"status":"ok"}
```

### Test Frontend

1. Open http://localhost:5173
2. Type "Create a hello world function in Python"
3. Click Send
4. Should see generated code

### Test OAuth

1. Click "Sign In"
2. Click "Continue with GitHub"
3. Should redirect to GitHub
4. After authorizing, redirected back to app
5. Should be logged in

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'flask'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Problem:** `OPENAI_API_KEY not found`
```bash
# Solution: Create .env file and add API key
echo "OPENAI_API_KEY=sk-your-key" > backend/.env
```

**Problem:** Port 5000 already in use
```bash
# Solution: Change port in app.py line 496
app.run(host='0.0.0.0', port=5001, debug=True)  # Changed to 5001
```

### Frontend Issues

**Problem:** `npm: command not found`
```bash
# Solution: Install Node.js from https://nodejs.org/
```

**Problem:** CORS error in browser console
```bash
# Solution: Make sure backend is running on port 5000
# Check backend/.env CORS settings
```

**Problem:** White screen
```bash
# Solution: Check browser console for errors
# Make sure backend is running
# Try clearing browser cache
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GlobalAssist.git
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Add new features
   - Fix bugs
   - Improve documentation

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Describe your changes

### Contribution Guidelines

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2025 Elmehdi Elmouate**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

## 👨‍💻 Author

**Elmehdi Elmouate**

- GitHub: [@GitMehdi-sys](https://github.com/GitMehdi-sys)
- Email: mehdielmo2020@gmail.com

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- Google for Gemini Pro
- React team for the amazing framework
- Flask team for the simple backend framework
- All contributors and users of GlobalAssist

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/GitMehdi-sys/GlobalAssist?style=social)
![GitHub forks](https://img.shields.io/github/forks/GitMehdi-sys/GlobalAssist?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/GitMehdi-sys/GlobalAssist?style=social)

---

## 🗺️ Roadmap

- [ ] Add support for more AI models
- [ ] Implement code completion
- [ ] Add collaborative coding features
- [ ] Mobile app (iOS/Android)
- [ ] VS Code extension
- [ ] Self-hosted option
- [ ] API for third-party integrations
- [ ] Multi-language support

---

## 💬 Support

Need help? Have questions?

- 📧 Email: mehdielmo2020@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/GitMehdi-sys/GlobalAssist/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/GitMehdi-sys/GlobalAssist/discussions)

---

## ⭐ Show Your Support

If you find GlobalAssist helpful, please consider:

- ⭐ Starring the repository
- 🍴 Forking and contributing
- 📢 Sharing with others
- 💬 Leaving feedback

---

<div align="center">

**Made with ❤️ by Elmehdi Elmouate**

[⬆ Back to Top](#-globalassist---ai-coding-assistant)

</div>
