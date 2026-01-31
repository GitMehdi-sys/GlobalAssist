# GlobalAssist - Frontend

React + Vite frontend for GlobalAssist coding assistant.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

App runs on: **http://localhost:5173**

## 📋 Features

- ✅ React 18 + Vite
- ✅ React Router for navigation
- ✅ Tailwind CSS styling
- ✅ JWT authentication
- ✅ Stripe payment integration
- ✅ Model selector in top-right
- ✅ Sidebar navigation
- ✅ History management
- ✅ Settings page
- ✅ Custom loader (no Vite default)
- ✅ Responsive design

## 🎨 Pages

- `/` - Home (chat interface)
- `/login` - Login page
- `/register` - Register page
- `/history/:type` - History pages (chat, project, artifact, code)
- `/settings` - User settings
- `/payment` - Subscription plans

## ⚙️ Environment Variables

Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## 📦 Deployment

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🔧 Development

```bash
# Run with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
