from google import genai
import os
from dotenv import load_dotenv

load_dotenv("d:/sih/agrisense-ai/backend/.env")
key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=key)

for model in ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-pro-latest"]:
    try:
        response = client.models.generate_content(
            model=model,
            contents="Explain in one short sentence why crop rotation with legumes improves soil nitrogen."
        )
        print(f"SUCCESS with {model}: {response.text.strip()}")
        break
    except Exception as e:
        print(f"Failed {model}: {e}")
