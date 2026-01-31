"""
GlobalAssist - Simple Backend with JSON File Storage
Fixed: OpenAI integration + OAuth (Google & GitHub)
"""

from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from datetime import datetime, timedelta
import secrets
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

# JSON Files for storage
DATA_DIR = 'data'
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
HISTORY_FILE = os.path.join(DATA_DIR, 'history.json')
SESSIONS_FILE = os.path.join(DATA_DIR, 'sessions.json')

# Create data directory
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize JSON files if they don't exist
def init_files():
    for file in [USERS_FILE, HISTORY_FILE, SESSIONS_FILE]:
        if not os.path.exists(file):
            with open(file, 'w') as f:
                json.dump([], f)

init_files()

# Helper functions
def read_json(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def write_json(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

def get_user_by_email(email):
    users = read_json(USERS_FILE)
    return next((u for u in users if u['email'] == email), None)

def get_user_by_id(user_id):
    users = read_json(USERS_FILE)
    return next((u for u in users if u['id'] == user_id), None)

def verify_token(token):
    sessions = read_json(SESSIONS_FILE)
    session = next((s for s in sessions if s['token'] == token), None)
    if session and datetime.fromisoformat(session['expires_at']) > datetime.utcnow():
        return session['user_id']
    return None

def require_auth(f):
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return f(user_id, *args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

# ============================================
# AUTHENTICATION ROUTES
# ============================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    # Check if user exists
    if get_user_by_email(email):
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create user
    users = read_json(USERS_FILE)
    user = {
        'id': len(users) + 1,
        'email': email,
        'password_hash': generate_password_hash(password),
        'full_name': full_name,
        'subscription_tier': 'free',
        'subscription_status': 'active',
        'created_at': datetime.utcnow().isoformat()
    }
    users.append(user)
    write_json(USERS_FILE, users)
    
    # Create session
    token = secrets.token_urlsafe(32)
    sessions = read_json(SESSIONS_FILE)
    sessions.append({
        'user_id': user['id'],
        'token': token,
        'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat()
    })
    write_json(SESSIONS_FILE, sessions)
    
    user_data = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({
        'access_token': token,
        'refresh_token': token,
        'user': user_data
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    user = get_user_by_email(email)
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create session
    token = secrets.token_urlsafe(32)
    sessions = read_json(SESSIONS_FILE)
    sessions.append({
        'user_id': user['id'],
        'token': token,
        'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat()
    })
    write_json(SESSIONS_FILE, sessions)
    
    user_data = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({
        'access_token': token,
        'refresh_token': token,
        'user': user_data
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@require_auth
def get_me(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({'user': user_data}), 200

# ============================================
# OAUTH ROUTES (Google & GitHub)
# ============================================

@app.route('/api/auth/google', methods=['GET'])
def google_auth():
    """Redirect to Google OAuth"""
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    if not client_id:
        return jsonify({'error': 'Google OAuth not configured'}), 500
    
    redirect_uri = 'http://localhost:5000/api/auth/google/callback'
    scope = 'email profile'
    auth_url = f'https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}'
    
    return redirect(auth_url)

@app.route('/api/auth/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    code = request.args.get('code')
    if not code:
        return redirect('http://localhost:5173/login?error=oauth_failed')
    
    try:
        # Exchange code for token
        token_url = 'https://oauth2.googleapis.com/token'
        data = {
            'code': code,
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'redirect_uri': 'http://localhost:5000/api/auth/google/callback',
            'grant_type': 'authorization_code'
        }
        response = requests.post(token_url, data=data)
        access_token = response.json().get('access_token')
        
        # Get user info
        user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get(user_info_url, headers=headers)
        user_info = user_response.json()
        
        # Create or get user
        email = user_info['email']
        user = get_user_by_email(email)
        
        if not user:
            users = read_json(USERS_FILE)
            user = {
                'id': len(users) + 1,
                'email': email,
                'password_hash': '',
                'full_name': user_info.get('name', ''),
                'subscription_tier': 'free',
                'subscription_status': 'active',
                'oauth_provider': 'google',
                'created_at': datetime.utcnow().isoformat()
            }
            users.append(user)
            write_json(USERS_FILE, users)
        
        # Create session
        token = secrets.token_urlsafe(32)
        sessions = read_json(SESSIONS_FILE)
        sessions.append({
            'user_id': user['id'],
            'token': token,
            'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat()
        })
        write_json(SESSIONS_FILE, sessions)
        
        # Redirect to frontend with token
        return redirect(f'http://localhost:5173/auth-success?token={token}')
    
    except Exception as e:
        print(f'Google OAuth error: {e}')
        return redirect('http://localhost:5173/login?error=oauth_failed')

@app.route('/api/auth/github', methods=['GET'])
def github_auth():
    """Redirect to GitHub OAuth"""
    client_id = os.getenv('GITHUB_CLIENT_ID')
    if not client_id:
        return jsonify({'error': 'GitHub OAuth not configured'}), 500
    
    redirect_uri = 'http://localhost:5000/api/auth/github/callback'
    scope = 'user:email'
    auth_url = f'https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}'
    
    return redirect(auth_url)

@app.route('/api/auth/github/callback', methods=['GET'])
def github_callback():
    """Handle GitHub OAuth callback"""
    code = request.args.get('code')
    if not code:
        return redirect('http://localhost:5173/login?error=oauth_failed')
    
    try:
        # Exchange code for token
        token_url = 'https://github.com/login/oauth/access_token'
        data = {
            'client_id': os.getenv('GITHUB_CLIENT_ID'),
            'client_secret': os.getenv('GITHUB_CLIENT_SECRET'),
            'code': code,
            'redirect_uri': 'http://localhost:5000/api/auth/github/callback'
        }
        headers = {'Accept': 'application/json'}
        response = requests.post(token_url, data=data, headers=headers)
        access_token = response.json().get('access_token')
        
        # Get user info
        user_url = 'https://api.github.com/user'
        headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get(user_url, headers=headers)
        user_info = user_response.json()
        
        # Get user email
        email_url = 'https://api.github.com/user/emails'
        email_response = requests.get(email_url, headers=headers)
        emails = email_response.json()
        primary_email = next((e['email'] for e in emails if e['primary']), emails[0]['email'])
        
        # Create or get user
        user = get_user_by_email(primary_email)
        
        if not user:
            users = read_json(USERS_FILE)
            user = {
                'id': len(users) + 1,
                'email': primary_email,
                'password_hash': '',
                'full_name': user_info.get('name', user_info.get('login', '')),
                'subscription_tier': 'free',
                'subscription_status': 'active',
                'oauth_provider': 'github',
                'created_at': datetime.utcnow().isoformat()
            }
            users.append(user)
            write_json(USERS_FILE, users)
        
        # Create session
        token = secrets.token_urlsafe(32)
        sessions = read_json(SESSIONS_FILE)
        sessions.append({
            'user_id': user['id'],
            'token': token,
            'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat()
        })
        write_json(SESSIONS_FILE, sessions)
        
        # Redirect to frontend with token
        return redirect(f'http://localhost:5173/auth-success?token={token}')
    
    except Exception as e:
        print(f'GitHub OAuth error: {e}')
        return redirect('http://localhost:5173/login?error=oauth_failed')

# ============================================
# AI MODEL ROUTES
# ============================================

@app.route('/api/ai/models', methods=['GET'])
def get_models():
    models = [
        {'id': 'kiwi-4.5', 'name': 'GlobalAssist 4.5', 'description': 'Fast and smart', 'tier': 'free', 'provider': 'anthropic'},
        {'id': 'kiwi-opus', 'name': 'GlobalAssist Opus', 'description': 'Most intelligent', 'tier': 'pro', 'provider': 'anthropic'},
        {'id': 'gpt-4', 'name': 'GPT-4 Turbo', 'description': 'OpenAI flagship', 'tier': 'pro', 'provider': 'openai'},
        {'id': 'gpt-3.5', 'name': 'GPT-3.5 Turbo', 'description': 'Fast and efficient', 'tier': 'free', 'provider': 'openai'},
        {'id': 'codellama', 'name': 'CodeLlama 34B', 'description': 'Open source', 'tier': 'free', 'provider': 'huggingface'},
        {'id': 'gemini-pro', 'name': 'Gemini Pro', 'description': 'Google AI', 'tier': 'pro', 'provider': 'google'}
    ]
    return jsonify({'models': models}), 200

@app.route('/api/ai/generate', methods=['POST'])
@require_auth
def generate_code(user_id):
    user = get_user_by_id(user_id)
    data = request.json
    prompt = data.get('prompt')
    model_id = data.get('model', 'kiwi-4.5')
    
    if not prompt:
        return jsonify({'error': 'Prompt required'}), 400
    
    # Check subscription for premium models
    premium_models = ['kiwi-opus', 'gpt-4', 'gemini-pro']
    if model_id in premium_models and user['subscription_tier'] == 'free':
        return jsonify({'error': 'Upgrade to Pro to use this model', 'upgrade_required': True}), 403
    
    # Generate code using ai_generator.py
    try:
        from ai_generator import generate_with_ai
        result = generate_with_ai(prompt, model_id)
    except Exception as e:
        print(f"AI generation error: {e}")
        result = {
            'code': f'''# Generated code for: {prompt}

def main():
    """
    AI-generated code example
    """
    print("Hello from GlobalAssist!")
    return True

if __name__ == "__main__":
    main()
''',
            'explanation': 'This is a demo response. Add your API keys to .env to enable AI code generation.'
        }
    
    # Save to history
    history = read_json(HISTORY_FILE)
    history_entry = {
        'id': len(history) + 1,
        'user_id': user_id,
        'type': 'chat',
        'title': prompt[:100],
        'content': result['code'],
        'model_used': model_id,
        'metadata': {'prompt': prompt, 'explanation': result.get('explanation', '')},
        'created_at': datetime.utcnow().isoformat()
    }
    history.append(history_entry)
    write_json(HISTORY_FILE, history)
    
    return jsonify({
        'success': True,
        'code': result['code'],
        'explanation': result.get('explanation', ''),
        'model_used': model_id,
        'history_id': history_entry['id']
    }), 200

# ============================================
# PAYMENT ROUTES
# ============================================

@app.route('/api/payment/plans', methods=['GET'])
def get_plans():
    plans = [
        {'id': 'free', 'name': 'Free', 'price': 0, 'billing': 'forever', 'features': ['50 messages/month', 'Basic models', '30-day history']},
        {'id': 'pro_monthly', 'name': 'Pro Monthly', 'price': 19, 'billing': 'monthly', 'features': ['1,000 messages/month', 'All models', 'Unlimited history']},
        {'id': 'pro_yearly', 'name': 'Pro Yearly', 'price': 190, 'billing': 'yearly', 'savings': 'Save $38!', 'features': ['1,000 messages/month', 'All models', 'Unlimited history']}
    ]
    return jsonify({'plans': plans}), 200

@app.route('/api/payment/create-checkout', methods=['POST'])
@require_auth
def create_checkout(user_id):
    return jsonify({'session_id': 'demo', 'url': 'https://stripe.com'}), 200

# ============================================
# HISTORY ROUTES
# ============================================

@app.route('/api/history/<history_type>', methods=['GET'])
@require_auth
def get_history(user_id, history_type):
    history = read_json(HISTORY_FILE)
    user_history = [h for h in history if h['user_id'] == user_id]
    
    if history_type != 'all':
        user_history = [h for h in user_history if h['type'] == history_type]
    
    return jsonify({'history': user_history, 'total': len(user_history)}), 200

@app.route('/api/history/<int:history_id>', methods=['DELETE'])
@require_auth
def delete_history(user_id, history_id):
    history = read_json(HISTORY_FILE)
    history = [h for h in history if not (h['id'] == history_id and h['user_id'] == user_id)]
    write_json(HISTORY_FILE, history)
    return jsonify({'message': 'History deleted'}), 200

# ============================================
# USER PROFILE ROUTES
# ============================================

@app.route('/api/user/profile', methods=['GET'])
@require_auth
def get_profile(user_id):
    user = get_user_by_id(user_id)
    user_data = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({'user': user_data}), 200

@app.route('/api/user/profile', methods=['PUT'])
@require_auth
def update_profile(user_id):
    data = request.json
    users = read_json(USERS_FILE)
    
    for user in users:
        if user['id'] == user_id:
            if 'full_name' in data:
                user['full_name'] = data['full_name']
            if 'email' in data:
                user['email'] = data['email']
            break
    
    write_json(USERS_FILE, users)
    user = get_user_by_id(user_id)
    user_data = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({'user': user_data}), 200

# ============================================
# HEALTH CHECK
# ============================================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════╗
    ║   GlobalAssist Backend                   ║
    ║   Running on http://localhost:5000       ║
    ║   Storage: JSON Files (No Database!)     ║
    ╚══════════════════════════════════════════╝
    """)
    app.run(host='0.0.0.0', port=5000, debug=True)
