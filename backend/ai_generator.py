"""
AI Code Generator - FIXED VERSION
Correctly uses OpenAI for GPT models and Anthropic for Claude
"""

import os
from dotenv import load_dotenv

load_dotenv()

def generate_with_ai(prompt, model_id):
    """
    Generate code using AI models
    """
    
    # Anthropic (Claude) - GlobalAssist models
    if model_id in ['kiwi-4.5', 'kiwi-opus']:
        try:
            from anthropic import Anthropic
            client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
            
            model_map = {
                'kiwi-4.5': 'claude-sonnet-4-20250514',
                'kiwi-opus': 'claude-opus-4-20250514'
            }
            
            response = client.messages.create(
                model=model_map[model_id],
                max_tokens=2000,
                messages=[{
                    "role": "user",
                    "content": f"Generate clean, production-ready code for: {prompt}\n\nProvide the code and a brief explanation."
                }]
            )
            
            content = response.content[0].text
            
            # Parse response
            if "```" in content:
                parts = content.split("```")
                code = parts[1].strip()
                if code.startswith(('python', 'javascript', 'java', 'cpp')):
                    code = '\n'.join(code.split('\n')[1:])
                explanation = parts[2] if len(parts) > 2 else "Code generated successfully"
            else:
                code = content
                explanation = "Code generated successfully"
            
            return {'code': code, 'explanation': explanation}
        except Exception as e:
            print(f"Anthropic error: {e}")
    
    # OpenAI (GPT) - FIXED: Using correct OpenAI client!
    elif model_id in ['gpt-4', 'gpt-3.5']:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            
            model_map = {
                'gpt-4': 'gpt-4-turbo-preview',
                'gpt-3.5': 'gpt-3.5-turbo'  # FIXED: Correct model name
            }
            
            response = client.chat.completions.create(
                model=model_map[model_id],
                messages=[{
                    "role": "user",
                    "content": f"Generate clean, production-ready code for: {prompt}\n\nProvide the code and a brief explanation."
                }],
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            
            if "```" in content:
                parts = content.split("```")
                code = parts[1].strip()
                if code.startswith(('python', 'javascript', 'java', 'cpp', 'c++')):
                    code = '\n'.join(code.split('\n')[1:])
                explanation = parts[2] if len(parts) > 2 else "Code generated successfully with OpenAI"
            else:
                code = content
                explanation = "Code generated successfully with OpenAI"
            
            return {'code': code, 'explanation': explanation}
        except Exception as e:
            print(f"OpenAI error: {e}")
            print(f"Make sure OPENAI_API_KEY is set in .env file")
    
    # Fallback - Demo response
    return {
        'code': f'''# Code for: {prompt}

def main():
    """
    Generated code example
    Add your API keys to .env to enable AI generation
    """
    print("Hello from GlobalAssist!")
    return True

if __name__ == "__main__":
    main()
''',
        'explanation': 'This is a demo response. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to your .env file to enable real AI code generation.'
    }
