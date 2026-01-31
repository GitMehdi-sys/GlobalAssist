# Kiwi AI - Backend API

## 🚀 Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env .env.local
# Edit .env with your API keys

# Run server
python app.py
```

Server runs on: **http://localhost:5000**

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### AI Models
- `GET /api/ai/models` - List models
- `POST /api/ai/generate` - Generate code
- `POST /api/ai/explain` - Explain code

### Payment
- `GET /api/payment/plans` - Get plans
- `POST /api/payment/create-checkout` - Create checkout
- `POST /api/payment/webhook` - Stripe webhook
- `GET /api/payment/subscription` - Get subscription
- `POST /api/payment/cancel` - Cancel subscription

### History
- `GET /api/history/<type>` - Get history
- `POST /api/history` - Create entry
- `DELETE /api/history/<id>` - Delete entry

### User Profile
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

## 🔐 Authentication

All protected endpoints require JWT token:

```bash
Authorization: Bearer <access_token>
```

## ✅ Testing

Test the API:

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📦 Deployment

### Heroku

```bash
heroku create kiwi-backend
heroku config:set FLASK_SECRET_KEY=xxx
heroku config:set ANTHROPIC_API_KEY=xxx
git push heroku main
```

### Railway

```bash
railway init
railway up
```
