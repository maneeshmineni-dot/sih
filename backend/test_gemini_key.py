from google import genai
import os
from dotenv import load_dotenv

load_dotenv("d:/sih/agrisense-ai/backend/.env")
key = os.getenv("GEMINI_API_KEY")

try:
    print("Testing Gemini Client with google.genai...")
    client = genai.Client(api_key=key)
    resp = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Say hello in 3 words"
    )
    print("Response:", resp.text.strip())
except Exception as e:
    print(f"Error: {e}")
