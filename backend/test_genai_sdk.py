from google import genai
import os
from dotenv import load_dotenv

load_dotenv("d:/sih/agrisense-ai/backend/.env")
key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=key)

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Explain in one sentence why crop rotation with legumes improves soil nitrogen."
)
print("Response:", response.text)
